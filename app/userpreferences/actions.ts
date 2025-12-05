'use server';

import { Resend } from 'resend';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);
const SECRET = new TextEncoder().encode(process.env.TURNSTILE_SECRET_KEY || 'fallback_secret_please_change'); 
// Note: Ideally add a distinct JWT_SECRET to your .env, but reusing a secret works for a start.

const loginSchema = z.object({
  email: z.string().email(),
});

// 1. GENERATE MAGIC LINK & SEND EMAIL
export async function sendMagicLink(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  
  const validated = loginSchema.safeParse({ email });
  if (!validated.success) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    // Create a signed token valid for 1 hour
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET);

    // Create the link (Adjust 'localhost' to your actual domain in production)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const link = `${baseUrl}/userpreferences/manage?token=${token}`;

    await resend.emails.send({
      from: "PlaceByte Security <noreply@placebyte.com>",
      to: email,
      subject: "Manage your PlaceByte Preferences",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Access your privacy settings</h2>
          <p>Click the link below to manage your communication preferences and data settings. This link expires in 1 hour.</p>
          <a href="${link}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Manage Preferences
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true, message: 'Link sent! Check your inbox.' };
  } catch (error) {
    console.error('Link Error:', error);
    return { success: false, message: 'Failed to send link. Please try again.' };
  }
}

// 2. VERIFY TOKEN (Helper for the page)
export async function verifyMagicToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { valid: true, email: payload.email as string };
  } catch (error) {
    return { valid: false, email: null };
  }
}

// 3. HANDLE PREFERENCE UPDATES
export async function updatePreferences(token: string, preferences: any) {
  // Verify again to ensure the request is legit
  const auth = await verifyMagicToken(token);
  if (!auth.valid || !auth.email) {
    return { success: false, message: 'Session expired. Please request a new link.' };
  }

  try {
    // SEND "ETL-READY" EMAIL TO YOUR ADMIN
    // This subject line helps your scripts pick it up automatically
    const subject = `[PREF_UPDATE] ${auth.email}`;
    
    const emailBody = `
      <h1>User Preference Update</h1>
      <p><strong>User:</strong> ${auth.email}</p>
      <p><strong>Action Required:</strong></p>
      <pre>${JSON.stringify(preferences, null, 2)}</pre>
      
      <hr />
      <h3>ETL Data Block:</h3>
      <code>
        {
          "user_email": "${auth.email}",
          "marketing_opt_in": ${preferences.marketing},
          "job_updates_opt_in": ${preferences.jobs},
          "request_deletion": ${preferences.deleteData},
          "timestamp": "${new Date().toISOString()}"
        }
      </code>
    `;

    await resend.emails.send({
      from: "PlaceByte System <system@placebyte.com>",
      to: "team@placebyte.com", // Your admin/ETL inbox
      subject: subject,
      html: emailBody,
    });

    if (preferences.deleteData) {
       return { success: true, message: 'Deletion request received. We are processing your removal.' };
    }

    return { success: true, message: 'Preferences updated successfully.' };

  } catch (error) {
    return { success: false, message: 'System error. Please try again.' };
  }
}