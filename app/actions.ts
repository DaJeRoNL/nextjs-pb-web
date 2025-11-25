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
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
        if (key !== 'cv') {
            rawData[key] = value;
        }
    });

    // 1. Bot Protection
    if (rawData.website_url && rawData.website_url.length > 0) {
      console.warn("Bot attempt blocked.");
      return { success: false, message: "Spam detected." };
    }

    // 2. Validate Data
    const validatedFields = formSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid data. Please check your inputs." };
    }

    const data = validatedFields.data;

    // 3. Handle CV Attachment
    const file = formData.get('cv') as File | null;
    let attachments = [];
    
    if (file && file.size > 0 && file.name !== 'undefined') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // 4. HTML Email Template
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

    // 5. SEND EMAIL
    // IMPORTANT: 
    // - 'from': MUST be onboarding@resend.dev until you verify placebyte.com
    // - 'to': MUST be the email you used to sign up for Resend (e.g., your personal email) until you verify domain
    
    await resend.emails.send({
      from: 'PlaceByte Website <onboarding@resend.dev>',
      to: ['team@placebyte.com'], // ⚠️ Change this to your PERSONAL signup email if "team@" is not the signup email
      subject: `PlaceByte Inquiry: ${data.name} (${data.typeParam})`,
      html: emailHtml,
      attachments: attachments,
    });

    return { success: true, message: 'Email sent successfully!' };

  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send email. Please try again later.' };
  }
}