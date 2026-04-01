import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";

/* 1️⃣ Update leave_requests status */
const UPDATE_STATUS = gql`
mutation UpdateStatus($id: Int!, $status: String!, $reviewed_at: timestamp!) {
  update_leave_requests_by_pk(
    pk_columns: { id: $id }
    _set: { status: $status, reviewed_at: $reviewed_at }
  ) {
    id
    user_id
    start_date
    end_date
  }
}
`;

/* 2️⃣ Update leave_balance using user_id */
const UPDATE_BALANCE = gql`
mutation UpdateBalance($user_id: Int!, $used_leave_inc: Int!, $remaining_leave_inc: Int!) {
  update_leave_balance(
    where: { user_id: { _eq: $user_id } }
    _inc: { used_leave: $used_leave_inc, remaining_leave: $remaining_leave_inc }
  ) {
    affected_rows
  }
}
`;

interface LeaveRequest {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
}

interface UpdateStatusResponse {
  update_leave_requests_by_pk: LeaveRequest | null;
}

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const reviewed_at = new Date().toISOString();

    /* Update leave_requests status */
    const result = await client.mutate<UpdateStatusResponse>({
      mutation: UPDATE_STATUS,
      variables: { id, status, reviewed_at },
    });

    const leave = result.data?.update_leave_requests_by_pk;

    if (!leave) return NextResponse.json({ success: false, message: "Leave request not found" }, { status: 404 });

    /* Calculate leave days */
    const leaveDays = leave.start_date && leave.end_date
      ? Math.floor((new Date(leave.end_date).getTime() - new Date(leave.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;

    /* Update leave_balance if approved */
    if (status === "approved" && leaveDays > 0) {
      await client.mutate({
        mutation: UPDATE_BALANCE,
        variables: {
          user_id: leave.user_id,
          used_leave_inc: leaveDays,          // pass positive number
          remaining_leave_inc: -leaveDays,    // pass negative number
        },
      });
    }

    return NextResponse.json({ success: true, message: `Leave ${status}`, leave_days: leaveDays });

  } catch (error) {
    console.error("Error managing leave:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}