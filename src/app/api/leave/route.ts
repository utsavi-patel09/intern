import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  users_by_user_id: {
    name: string;
  };
}

interface LeaveResponse {
  leave_requests: LeaveRequest[];
}

const GET_LEAVES = gql`
query GetLeaves($user_id:Int!) {
  leave_requests(
    where:{manager_id:{_eq:$user_id}}
    order_by:{applied_at:desc}
  ){
    id
    leave_type
    start_date
    end_date
    reason
    status
    users_by_user_id {
      name
    }
  }
}
`;

export async function GET() {

  try {

    /* Get logged in user session */

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success:false, leaves:[] },
        { status:401 }
      );
    }

    const user_id = Number(session.user.id);

    /* Fetch leave requests */

    const result = await client.query<LeaveResponse>({
      query: GET_LEAVES,
      variables:{ user_id },
      fetchPolicy:"no-cache"
    });

    const leaves = result?.data?.leave_requests ?? [];

    return NextResponse.json({
      success:true,
      leaves
    });

  } catch (error) {

    console.error("Error fetching leaves:", error);

    return NextResponse.json(
      {
        success:false,
        message:"Failed to fetch leave requests",
        leaves:[]
      },
      { status:500 }
    );

  }

}