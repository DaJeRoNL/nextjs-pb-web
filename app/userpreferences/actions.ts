'use server';

import { Resend } from 'resend';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';
import { validateTurnstile } from '../lib/security'; // Import helper

const escapeHtml = (unsafe: string | number | null | undefined) => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const JWT_SECRET_STR = process.env.JWT_SECRET; 
if (!JWT_SECRET_STR) {
  console.error("JWT_SECRET is missing in environment variables!");
}
const SECRET = new TextEncoder().encode(JWT_SECRET_STR || 'temporary_dev_secret_CHANGE_ME');

const resend = new Resend(process.env.RESEND_API_KEY);

const loginSchema = z.object({
  email: z.string().email(),
});

// 1. GENERATE MAGIC LINK
export async function sendMagicLink(prevState: any, formData: FormData) {
  // Honeypot
  const honeypot = formData.get('website_url');
  if (honeypot && honeypot.toString().length > 0) {
    return { success: false, message: "Spam detected." };
  }

  // Turnstile
  const turnstileToken = formData.get('cf-turnstile-response') as string;
  const securityCheck = await validateTurnstile(turnstileToken);
  if (!securityCheck.success) {
    return { success: false, message: securityCheck.message };
  }

  const email = formData.get('email') as string;
  const validated = loginSchema.safeParse({ email });
  if (!validated.success) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://placebyte.com';
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
        </div>
      `,
    });

    return { success: true, message: 'Link sent! Check your inbox.' };
  } catch (error) {
    console.error('Link Error:', error);
    return { success: false, message: 'Failed to send link. Please try again.' };
  }
}

// 2. VERIFY TOKEN
export async function verifyMagicToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { valid: true, email: payload.email as string };
  } catch (error) {
    return { valid: false, email: null };
  }
}

// 3. UPDATE PREFERENCES
export async function updatePreferences(token: string, preferences: any, turnstileToken: string) {
  // Security Check
  const securityCheck = await validateTurnstile(turnstileToken);
  if (!securityCheck.success) {
    return { success: false, message: securityCheck.message };
  }

  const auth = await verifyMagicToken(token);
  if (!auth.valid || !auth.email) {
    return { success: false, message: 'Session expired. Please request a new link.' };
  }

  try {
    const subject = `[PREF_UPDATE] ${auth.email}`;
    const emailBody = `
      <h1>User Preference Update</h1>
      <p><strong>User:</strong> ${escapeHtml(auth.email)}</p>
      <pre>${escapeHtml(JSON.stringify(preferences, null, 2))}</pre>
    `;

    await resend.emails.send({
      from: "PlaceByte System <system@placebyte.com>",
      to: "team@placebyte.com",
      subject: subject,
      html: emailBody,
    });

    if (preferences.deleteData) {
       return { success: true, message: 'Deletion request received. Processing removal.' };
    }

    return { success: true, message: 'Preferences updated successfully.' };
  } catch (error) {
    return { success: false, message: 'System error. Please try again.' };
  }
}