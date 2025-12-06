'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { validateTurnstile } from './lib/security'; // Import helper

const escapeHtml = (unsafe: string | number | null | undefined) => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  website_url: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().optional(),
  role: z.string().optional(),
  specificRole: z.string().optional(),
  contactMethod: z.string().optional(),
  details: z.string().optional(),
  message: z.string().optional(),
  typeParam: z.string().optional(),
});

export async function sendEmail(prevState: any, formData: FormData) {
  try {
    const rawData: Record<string, any> = {};
    const turnstileToken = formData.get('cf-turnstile-response') as string;

    // 1. Bot Protection (Honeypot)
    if (formData.get('website_url')) {
      console.warn("Bot attempt blocked (honeypot).");
      return { success: false, message: "Spam detected." };
    }

    // 2. Centralized Turnstile Verification
    const securityCheck = await validateTurnstile(turnstileToken);
    if (!securityCheck.success) {
      return { success: false, message: securityCheck.message };
    }

    // Collect Data
    formData.forEach((value, key) => {
        if (key !== 'cv' && key !== 'cf-turnstile-response') {
            rawData[key] = value;
        }
    });

    // 3. Validate Data
    const validatedFields = formSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid data. Please check your inputs." };
    }

    const data = validatedFields.data;

    // File Handling
    const file = formData.get('cv'); 
    let attachments = [];
    if (file instanceof File && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, message: "File too large (max 5MB)" };
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: file.name,
        content: buffer.toString("base64"),
        type: file.type || "application/pdf",
        disposition: "attachment",
      });
    }

    // 4. HTML Email Template
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #000;">New Submission: ${escapeHtml(data.name)}</h2>
        <p><strong>Source:</strong> ${escapeHtml(data.typeParam || 'General Inquiry')}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${Object.entries(data).map(([key, value]) => {
            // Skip internal fields or empty values
            if (['website_url', 'typeParam', 'terms'].includes(key) || !value) return '';
            
            return `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 180px; text-transform: capitalize;">
                  ${escapeHtml(key.replace(/([A-Z])/g, ' $1').trim())}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  ${escapeHtml(value)}
                </td>
              </tr>
            `;
          }).join('')}
        </table>
      </div>
    `;

    await resend.emails.send({
      from: "PlaceByte <noreply@placebyte.com>",
      to: ["team@placebyte.com"],
      subject: `Inquiry from ${data.name} (${data.company || "No company"})`,
      html: emailHtml,
      attachments,
    });

    return { success: true, message: 'Email sent successfully!' };

  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send email. Please try again later.' };
  }
}