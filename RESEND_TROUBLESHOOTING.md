# Resend Email Not Receiving - Troubleshooting Guide

## Issue
The contact form works without errors, but emails are not arriving at `s.moinuddin2310@gmail.com`.

## Root Cause
Resend's test email `onboarding@resend.dev` has restrictions:
- Can only send to **verified email addresses** in your Resend account
- OR you need to verify your own domain

## Solutions

### Option 1: Add Your Email to Resend (Quickest)

1. **Go to Resend Dashboard:**
   - Visit: https://resend.com/emails
   - Login with your account

2. **Add Verified Email:**
   - Go to "Settings" → "Verified Emails"
   - Click "Add Email"
   - Enter: `s.moinuddin2310@gmail.com`
   - Check your Gmail for verification email
   - Click the verification link

3. **Test Again:**
   - Submit the contact form
   - Email should now arrive!

### Option 2: Verify Your Domain (Production Ready)

1. **Add Your Domain:**
   - Go to Resend Dashboard → "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `moinuddin.dev`)

2. **Add DNS Records:**
   - Resend will show you DNS records to add
   - Add these to your domain registrar (GoDaddy, Namecheap, etc.)
   - Wait for verification (can take up to 48 hours)

3. **Update API Route:**
   ```typescript
   from: 'Portfolio <noreply@yourdomain.com>',
   ```

### Option 3: Use EmailJS (No Domain Required)

If you want to skip domain verification entirely:

1. **Install EmailJS:**
   ```bash
   npm install @emailjs/browser
   ```

2. **Sign up at:** https://www.emailjs.com

3. **Update ContactForm.tsx** to use EmailJS instead

## Quick Check - Is Resend Working?

Check your terminal logs when you submit the form. You should see:
```
Email sent successfully to s.moinuddin2310@gmail.com from [sender]
Resend ID: [some-id]
```

If you see an error instead, that's the issue!

## Common Errors

### Error: "Email not verified"
**Solution:** Add `s.moinuddin2310@gmail.com` to verified emails in Resend

### Error: "Domain not verified"
**Solution:** Either verify your domain OR use Resend's test domain with verified emails

### No Error But No Email
**Possible causes:**
1. Email in spam folder (check Gmail spam)
2. Resend free tier limits reached (100 emails/day)
3. API key invalid or expired

## Recommended: Check Resend Dashboard

1. Go to: https://resend.com/emails
2. Look at "Recent Emails" section
3. You should see your sent emails there
4. Click on them to see delivery status
5. If status is "Bounced" or "Failed", you'll see why

## Current Setup

Your `.env.local`:
```
RESEND_API_KEY=re_bCvePbbn_4cBtpi7qQGgKs3h7XLJXjZd1
CONTACT_EMAIL=s.moinuddin2310@gmail.com
```

**Action Required:**
1. Login to Resend: https://resend.com
2. Check "Recent Emails" to see if emails are being sent
3. Add `s.moinuddin2310@gmail.com` to verified emails
4. Test again!
