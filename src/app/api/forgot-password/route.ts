import { NextResponse } from "next/server";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import nodemailer from "nodemailer";

const CHECK_USER = gql`
  query CheckUser($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
    }
  }
`;

const UPDATE_USER_OTP = gql`
  mutation UpdateUserOTP($email: String!, $otp: String!, $expiry: timestamp!) {
    update_users(where: { email: { _eq: $email } }, _set: { otp: $otp, otp_expiry: $expiry }) {
      affected_rows
    }
  }
`;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if user exists
    const { data } = await client.query<{ users: any[] }>({
      query: CHECK_USER,
      variables: { email },
      fetchPolicy: "network-only",
    });

    if (!data?.users || data.users.length === 0) {
      // Return 200 even if not found to prevent email enumeration attacks
      return NextResponse.json({ message: "If your email is in our system, you will receive an OTP." });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // 3. Save OTP to DB
    await client.mutate({
      mutation: UPDATE_USER_OTP,
      variables: { email, otp, expiry },
    });

    // 4. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"InternHub Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1E3A5F; text-align: center;">InternHub Password Reset</h2>
          <p>We received a request to reset your password. Here is your One-Time Password (OTP):</p>
          <div style="background-color: #f4f7f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0EA5E9; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. If you didn't request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">InternHub &copy; ${new Date().getFullYear()}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Forgot Password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
