'use server';

import { Resend } from 'resend';
import { z } from 'zod';

// Ensure your RESEND_API_KEY is in your .env.local file
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
    console.log("--- New Form Submission Started ---");
    
    const rawData: Record<string, any> = {};
    const turnstileToken = formData.get('cf-turnstile-response');

    // Filter non-text data
    formData.forEach((value, key) => {
        if (key !== 'cv' && key !== 'cf-turnstile-response') {
            rawData[key] = value;
        }
    });

    // 1. Bot Protection
    if (rawData.website_url && rawData.website_url.length > 0) {
      console.warn("Bot attempt blocked (honeypot).");
      return { success: false, message: "Spam detected." };
    }
    
    // 2. Turnstile Verification
    if (!turnstileToken || typeof turnstileToken !== 'string') {
        console.error("Turnstile token missing");
        return { success: false, message: "Security check missing. Please refresh and try again." };
    }

    const verifyResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error("Validation failed:", validatedFields.error);
      return { success: false, message: "Invalid data. Please check your inputs." };
    }

    const data = validatedFields.data;

    // --- DEBUGGING FILE ATTACHMENT ---
    const file = formData.get('cv'); 
    let attachments = [];

    console.log("File retrieval debug:");
    console.log("- Raw value from formData:", file);
    // console.log("- Type of file:", typeof file); // Can be misleading in server environment
    console.log("- Is instance of File?", file instanceof File);

    if (file instanceof File) {
        console.log("- File name:", file.name);
        console.log("- File size:", file.size);
        console.log("- File type:", file.type);

        if (file.size > 0) {
            if (file.size > 5 * 1024 * 1024) {
                console.error("File too large");
                return { success: false, message: "File too large (max 5MB)" };
            }

            try {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                attachments.push({
                    filename: file.name,
                    content: buffer, 
                });
                console.log("File successfully processed and added to attachments array.");
            } catch (fileError) {
                console.error("Error processing file buffer:", fileError);
            }
        } else {
            console.warn("File found but size is 0 bytes.");
        }
    } else {
        console.warn("No valid file object found in 'cv' field.");
    }

    // 4. Send Email
    console.log("Attempting to send email via Resend...");
    console.log("Attachments count:", attachments.length);

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

    const result = await resend.emails.send({
      from: "PlaceByte <noreply@placebyte.com>",
      to: ["team@placebyte.com"],
      subject: `Inquiry from ${data.name} (${data.company || "No company"})`,
      html: emailHtml,
      attachments,
    });

    if (result.error) {
        console.error("Resend API Error:", result.error);
        return { success: false, message: 'Failed to send email via provider.' };
    }

    console.log("Email sent successfully!", result);
    return { success: true, message: 'Email sent successfully!' };

  } catch (error) {
    console.error('UNEXPECTED ERROR in sendEmail:', error);
    return { success: false, message: 'Failed to send email. Please try again later.' };
  }
}