import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";

// Define a type for the user
type User = {
  id: number;
  name: string;
};

// Define the shape of the GraphQL response
type GetInternsResponse = {
  users: User[];
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ deptId: string }> }
) {
  // ── Auth: admin or manager only ──
  const { errorResponse } = await requireAuth(["admin", "manager"]);
  if (errorResponse) return errorResponse;

  const { deptId } = await params;

  const query = gql`
    query GetInterns($deptId:Int!) {
      users(where:{
        role:{_eq:"intern"},
        department_id:{_eq:$deptId}
      }){
        id
        name
      }
    }
  `;

  try {
    const { data } = await client.query<GetInternsResponse>({
      query,
      variables: { deptId: Number(deptId) },
      fetchPolicy: "no-cache",
    });

    // Now TypeScript knows data has property 'users'
    return NextResponse.json(data?.users);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching interns", details: error });
  }
}