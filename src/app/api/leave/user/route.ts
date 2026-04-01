// File: src/app/api/leave/user/route.ts
import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Interfaces
interface Leave {
  id: number;
  status: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface LeaveBalance {
  used_leave: number;
  remaining_leave: number;
}

interface GetUserLeavesResponse {
  leave_requests: Leave[];
  leave_balance: LeaveBalance[];
}

export async function GET(req: Request) {
  try {
    // Get session on server
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // GraphQL query
    const GET_LEAVES = gql`
      query GetUserLeaves($user_id: Int!) {
        leave_requests(where: { user_id: { _eq: $user_id } }, order_by: { start_date: desc }) {
          id
          status
          leave_type
          start_date
          end_date
          reason
        }
        leave_balance(where: { user_id: { _eq: $user_id } }) {
          used_leave
          remaining_leave
        }
      }
    `;

    const result = await client.query<GetUserLeavesResponse>({
      query: GET_LEAVES,
      variables: { user_id: userId },
      fetchPolicy: "no-cache",
    });

    const leaves: Leave[] = result.data?.leave_requests || [];
    const balance: LeaveBalance = result.data?.leave_balance?.[0] || { used_leave: 0, remaining_leave: 0 };

    const summary = {
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "pending").length,
      approved: leaves.filter((l) => l.status === "approved").length,
      rejected: leaves.filter((l) => l.status === "rejected").length,
      used_leave: balance.used_leave,
      remaining_leave: balance.remaining_leave,
    };

    return NextResponse.json({ success: true, summary, leaves });
  } catch (err) {
    console.error("Error fetching leave summary:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}