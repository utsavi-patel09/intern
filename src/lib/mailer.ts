import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Sends an email using the configured SMTP transport.
 */
export async function sendEmail({ to, subject, text, html }: MailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"InternHub Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Send Email Error:", error);
    return { success: false, error };
  }
}

/**
 * Generates the HTML template for the OTP email.
 */
export function getOtpTemplate(otp: string) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #1E3A5F 0%, #0EA5E9 100%); border-radius: 16px; padding: 12px;">
          <svg style="width: 40px; height: 40px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
      
      <h2 style="color: #0f172a; text-align: center; font-size: 24px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.025em;">Reset Your Password</h2>
      <p style="color: #64748b; text-align: center; font-size: 16px; margin-bottom: 32px;">Use the following One-Time Password (OTP) to securely reset your InternHub account password.</p>
      
      <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; padding: 24px; text-align: center; border-radius: 16px; margin-bottom: 32px;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #0EA5E9; letter-spacing: 0.25em; display: inline-block;">${otp}</span>
      </div>
      
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 32px; border-radius: 4px;">
        <p style="color: #92400e; font-size: 14px; margin: 0;"><strong>Heads up!</strong> This OTP is only valid for 10 minutes. If you didn't request a password reset, please ignore this email.</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;" />
      
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} InternHub. All rights reserved.</p>
    </div>
  `;
}
