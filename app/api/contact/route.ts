import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitizeContactInput } from '@/lib/sanitize';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Zod validation schema
const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  trap: z.string().optional(), // Honeypot field
});

/**
 * Get client IP address from request headers
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return 'unknown';
}

export async function POST(request: Request) {
  try {
    // Step A: Rate Limiting
    const clientIp = getClientIp(request);
    
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: 60 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Step B: Honeypot (Anti-Bot)
    if (body.trap && body.trap.length > 0) {
      // Bot detected! Return fake success to trick the bot
      console.warn(`Bot detected from IP: ${clientIp}, trap field filled`);
      return NextResponse.json(
        { 
          message: 'Message sent successfully',
          status: 'success'
        },
        { status: 200 }
      );
    }

    // Step C: Zod Validation
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors 
        },
        { status: 400 }
      );
    }

    const { email, subject, message } = validationResult.data;

    // Step D: Sanitization (Anti-XSS)
    const sanitized = sanitizeContactInput(email, message);
    const sanitizedSubject = subject.replace(/[<>]/g, ''); // Remove angle brackets from subject

    // Step E: Send Email using Resend
    const contactEmail = process.env.CONTACT_EMAIL || 's.moinuddin2310@gmail.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: contactEmail,
      replyTo: sanitized.email,
      subject: `Portfolio Contact: ${sanitizedSubject}`,
      text: `From: ${sanitized.email}\n\nSubject: ${sanitizedSubject}\n\nMessage:\n${sanitized.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">New Contact Form Submission</h2>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${sanitized.email}</p>
            <p><strong>Subject:</strong> ${sanitizedSubject}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #475569; margin-top: 0;">Message:</h3>
            <p style="color: #334155; line-height: 1.6; white-space: pre-wrap;">${sanitized.message}</p>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully!');
    console.log(`   To: ${contactEmail}`);
    console.log(`   From: ${sanitized.email}`);
    console.log(`   Subject: ${sanitizedSubject}`);
    console.log(`   Resend ID: ${data?.id}`);
    console.log(`   Check Resend Dashboard: https://resend.com/emails`);

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        status: 'success',
        id: data?.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
