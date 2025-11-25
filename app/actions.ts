'use server';

import { Resend } from 'resend';
import { z } from 'zod';

// Ensure your RESEND_API_KEY and TURNSTILE_SECRET_KEY are in your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  website_url: z.string().optional(), // Honeypot
  
  // Specific fields
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
    formData.forEach((value, key) => {
        if (key !== 'cv') {
            rawData[key] = value;
        }
    });

    // 1. Bot Protection (Honeypot)
    if (rawData.website_url && rawData.website_url.length > 0) {
      console.warn("Bot attempt blocked (honeypot).");
      return { success: false, message: "Spam detected." };
    }

    // 2. Cloudflare Turnstile Verification
    const turnstileToken = formData.get('cf-turnstile-response');
    
    if (!turnstileToken || typeof turnstileToken !== 'string') {
        return { success: false, message: "Security check missing. Please refresh and try again." };
    }

    const verifyResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
        }),
    });

    const verifyOutcome = await verifyResult.json();

    if (!verifyOutcome.success) {
        console.error("Turnstile verification failed:", verifyOutcome);
        return { success: false, message: "Security check failed. Please reload and try again." };
    }

    // 3. Validate Data
    const validatedFields = formSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid data. Please check your inputs." };
    }

    const data = validatedFields.data;

    // 4. Handle CV Attachment
    const file = formData.get('cv') as File | null;

    if (file && file.size > 5 * 1024 * 1024) {
      return { success: false, message: "File too large (max 5MB)" };
    }

    let attachments = [];
    
    if (file && file.size > 0 && file.name !== 'undefined') {
    
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: file.name,
        content: buffer.toString("base64"),
        type: file.type || "application/pdf",
        disposition: "attachment",
      });
    }

    // 5. HTML Email Template
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #000;">New Submission: ${data.name}</h2>
        <p><strong>Source:</strong> ${data.typeParam || 'General Inquiry'}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${Object.entries(data).map(([key, value]) => {
            if (['website_url', 'typeParam', 'terms'].includes(key) || !value) return '';
            
            return `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 180px; text-transform: capitalize;">
                  ${key.replace(/([A-Z])/g, ' $1').trim()}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  ${value}
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