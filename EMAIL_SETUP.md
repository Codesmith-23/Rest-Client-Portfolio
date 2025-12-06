# Email Setup Guide for Contact Form

Your contact form is now connected to a real API endpoint at `/api/contact`. To actually send emails, you need to choose and implement an email service.

## Option 1: Resend (Recommended - Easy & Free Tier)

### Steps:
1. **Install Resend:**
   ```bash
   npm install resend
   ```

2. **Get API Key:**
   - Sign up at https://resend.com
   - Get your API key from the dashboard
   - Add to `.env.local`:
     ```
     RESEND_API_KEY=re_your_api_key_here
     ```

3. **Update `app/api/contact/route.ts`:**
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   // Inside the POST function, replace the TODO section:
   await resend.emails.send({
     from: 'portfolio@yourdomain.com', // Must be verified domain
     to: 's.moinuddin2310@gmail.com',
     subject: subject,
     text: message,
     replyTo: 'noreply@yourdomain.com',
   });
   ```

4. **Verify your domain** (or use Resend's test domain for development)

---

## Option 2: EmailJS (No Backend Required)

### Steps:
1. **Install EmailJS:**
   ```bash
   npm install @emailjs/browser
   ```

2. **Setup:**
   - Sign up at https://www.emailjs.com
   - Create an email service (Gmail, Outlook, etc.)
   - Create an email template
   - Get your Public Key, Service ID, and Template ID

3. **Add to `.env.local`:**
   ```
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   ```

4. **Update `components/preview/ContactForm.tsx`:**
   ```typescript
   import emailjs from '@emailjs/browser';
   
   const handleSend = async () => {
     try {
       await emailjs.send(
         process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
         process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
         {
           subject: subject,
           message: message,
           to_email: 's.moinuddin2310@gmail.com',
         },
         process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
       );
       
       toast.success('Message sent successfully');
       setSubject('');
       setMessage('');
     } catch (error) {
       toast.error('Failed to send message');
     }
   };
   ```

---

## Option 3: Nodemailer (Full Control)

### Steps:
1. **Install Nodemailer:**
   ```bash
   npm install nodemailer
   ```

2. **Add to `.env.local`:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Update `app/api/contact/route.ts`:**
   ```typescript
   import nodemailer from 'nodemailer';
   
   const transporter = nodemailer.createTransporter({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS, // Use App Password for Gmail
     },
   });
   
   await transporter.sendMail({
     from: process.env.EMAIL_USER,
     to: 's.moinuddin2310@gmail.com',
     subject: subject,
     text: message,
   });
   ```

4. **For Gmail:** Enable 2FA and create an App Password

---

## Option 4: Formspree (Simplest - No Code)

### Steps:
1. Sign up at https://formspree.io
2. Create a form and get your form ID
3. Update the fetch URL in ContactForm:
   ```typescript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ subject, message }),
   });
   ```

---

## Current Status

✅ API endpoint created at `/api/contact`
✅ Contact form connected to API
✅ Form validation working
✅ Toast notifications working
⏳ Email sending needs to be configured (choose option above)

## Testing

Right now, when you submit the form:
- The data is logged to your terminal (check where you ran `npm run dev`)
- You'll see the subject and message printed
- This confirms the API is working

Choose one of the options above to enable actual email delivery!
