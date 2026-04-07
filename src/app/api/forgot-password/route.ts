import { NextResponse } from "next/server";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { sendEmail, getOtpTemplate } from "@/lib/mailer";

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
    // 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); 

    // 3. Save OTP to DB
    await client.mutate({
      mutation: UPDATE_USER_OTP,
      variables: { email, otp, expiry },
    });

    // 4. Send email using centralized utility
    const result = await sendEmail({
      to: email,
      subject: "Reset Your InternHub Password",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
      html: getOtpTemplate(otp),
    });

    if (!result.success) {
      throw new Error("Failed to send email");
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Forgot Password error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
