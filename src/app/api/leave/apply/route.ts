import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";

/* =========================
   Interfaces
========================= */

export interface LeaveRequest {
  id: number;
  user_id: number;
  manager_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  applied_at?: string;
  reviewed_at?: string | null;
}

export interface LeaveBalance {
  id?: number;
  user_id: number;
  total_leave: number;
  used_leave: number;
  remaining_leave: number;
  updated_at?: string;
}

export interface ApplyLeavePayload {
  user_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface UserInfoResponse {
  users_by_pk: {
    id: number;
    department_id: number;
  };
  leave_balance: {
    remaining_leave: number;
  }[];
}

interface ManagerResponse {
  users: {
    id: number;
  }[];
}

interface OverlapResponse {
  leave_requests: {
    id: number;
  }[];
}

interface InsertLeaveResponse {
  insert_leave_requests_one: {
    id: number;
    status: string;
  };
}

/* =========================
   GraphQL Queries
========================= */

const GET_USER_INFO = gql`
query GetUserInfo($user_id:Int!){
  users_by_pk(id:$user_id){
    id
    department_id
  }
  leave_balance(where:{user_id:{_eq:$user_id}}){
    remaining_leave
  }
}
`;

const GET_MANAGER = gql`
query GetManager($department_id:Int!){
  users(
    where:{
      role:{_eq:"manager"},
      department_id:{_eq:$department_id}
    }
    limit:1
  ){
    id
  }
}
`;

const CHECK_OVERLAP = gql`
query CheckOverlap($user_id:Int!,$start_date:date!,$end_date:date!){
  leave_requests(
    where:{
      user_id:{_eq:$user_id},
      status:{_neq:"rejected"},
      start_date:{_lte:$end_date},
      end_date:{_gte:$start_date}
    }
  ){
    id
  }
}
`;

const INSERT_LEAVE = gql`
mutation ApplyLeave($object:leave_requests_insert_input!){
  insert_leave_requests_one(object:$object){
    id
    status
  }
}
`;

/* =========================
   POST API
========================= */

export async function POST(req: Request) {
  // ── Auth: intern only ──
  const { errorResponse } = await requireAuth(["intern"]);
  if (errorResponse) return errorResponse;

  try {

    const body: ApplyLeavePayload = await req.json();
    const { user_id, leave_type, start_date, end_date, reason } = body;

    const start = new Date(start_date);
    const end = new Date(end_date);

    /* Date validation */

    if (end < start) {
      return NextResponse.json(
        { error: "End date cannot be before start date" },
        { status: 400 }
      );
    }

    const days =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

    /* Get department + leave balance */

    const { data } = await client.query<UserInfoResponse>({
      query: GET_USER_INFO,
      variables: { user_id },
      fetchPolicy: "no-cache"
    });

    const department_id = data?.users_by_pk?.department_id;
    const remaining = data?.leave_balance?.[0]?.remaining_leave ?? 0;

    if (!department_id) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 400 }
      );
    }

    /* Check leave balance */

    if (days > remaining) {
      return NextResponse.json(
        { error: "Not enough leave balance" },
        { status: 400 }
      );
    }

    /* Find manager */

    const managerQuery = await client.query<ManagerResponse>({
      query: GET_MANAGER,
      variables: { department_id: Number(department_id) },
      fetchPolicy: "no-cache"
    });

    const managers = managerQuery?.data?.users || [];
    const manager_id = managers[0]?.id;

    if (!manager_id) {
      return NextResponse.json(
        { error: "No manager found for your department. Please contact HR." },
        { status: 400 }
      );
    }

    /* Check overlapping leave */

    const overlapCheck = await client.query<OverlapResponse>({
      query: CHECK_OVERLAP,
      variables: { user_id, start_date, end_date },
      fetchPolicy: "no-cache"
    });

    const existingLeaves = overlapCheck?.data?.leave_requests ?? [];

    if (existingLeaves.length > 0) {
      return NextResponse.json(
        { error: "You already have a leave request during this period" },
        { status: 400 }
      );
    }

    /* Insert leave request */

    const result = await client.mutate<InsertLeaveResponse>({
      mutation: INSERT_LEAVE,
      variables: {
        object: {
          user_id,
          manager_id,
          leave_type,
          start_date,
          end_date,
          reason,
          status: "pending"
        }
      }
    });

    return NextResponse.json({
      success: true,
      leave: result.data?.insert_leave_requests_one
    });

  } catch (err: any) {
    console.error("Apply Leave Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to apply leave" },
      { status: 500 }
    );
  }
}