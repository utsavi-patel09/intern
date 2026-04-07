import { NextResponse } from "next/server";
import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

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

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const { data } = await client.query<{ users: any[] }>({
      query: VERIFY_OTP,
      variables: { 
        email, 
        otp, 
        now: new Date().toISOString() 
      },
      fetchPolicy: "network-only",
    });

    if (!data?.users || data.users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
