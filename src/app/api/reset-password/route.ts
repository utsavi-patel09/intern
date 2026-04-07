import { NextResponse } from "next/server";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import bcrypt from "bcryptjs";

// Double check OTP validity before resetting
const VERIFY_OTP = gql`
  query VerifyOTP($email: String!, $otp: String!, $now: timestamp!) {
    users(where: { 
      email: { _eq: $email }, 
      otp: { _eq: $otp },
      otp_expiry: { _gt: $now } 
    }) {
      id
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $password: String!) {
    update_users(
      where: { email: { _eq: $email } }
      _set: { password: $password, otp: null, otp_expiry: null }
    ) {
      affected_rows
    }
  }
`;

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify OTP again for security
    const { data: verifyData } = await client.query<{ users: any[] }>({
      query: VERIFY_OTP,
      variables: { 
        email, 
        otp, 
        now: new Date().toISOString() 
      },
      fetchPolicy: "network-only",
    });

    if (!verifyData?.users || verifyData.users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password and clear OTP
    await client.mutate({
      mutation: RESET_PASSWORD,
      variables: { email, password: hashedPassword },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
