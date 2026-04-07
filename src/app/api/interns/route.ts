import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";

// ==================== GraphQL Query ====================

const GET_INTERNS = gql`
  query GetInternUsers {
    interns {
      id
      user_id
      college
      phone_number
      start_date
      gender
      end_date
      stipend
      department_id
      user {          # matches Hasura relationship
        id
        name
        email
        role
        created_at
      }
    }
  }
`;


// PUT / Update intern by ID
const UPDATE_INTERN_BY_USER_ID = gql`
  mutation UpdateInternByUserId(
    $user_id: Int!, 
    $phone_number: String,
    $college: String,
    $gender: String,
    $end_date: date,
    $stipend: Int
  ) {
    update_interns(
      where: { user_id: { _eq: $user_id } }, 
      _set: { 
        phone_number: $phone_number,
        college: $college,
        gender: $gender,
        end_date: $end_date,
        stipend: $stipend
      }
    ) {
      returning {
        id
        user_id
        phone_number
        gender
        end_date
        stipend
      }
    }
  }
`;

// ==================== TypeScript Interfaces ====================

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string | null;
}

interface Intern {
  id: number;
  user_id: number;
  college: string;
  phone_number: string;
  start_date: string;
  gender?: string | null;
  end_date?: string | null;
  stipend?: number | null;
  department_id: number | null;
  user: User;   // match relationship name
}

interface UpdateInternResponse {
  update_interns: {
    returning: Intern[];
  };
}

// ==================== API Handler ====================

export async function GET() {
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const res = await client.query<{ interns: Intern[] }>({
      query: GET_INTERNS,
      fetchPolicy: "network-only",
    });

    const interns = res.data?.interns || [];

    const combined = interns.map((i) => ({
      id: i.user?.id,
      name: i.user?.name,
      email: i.user?.email,
      role: i.user?.role,
      department_id: i.department_id,
      created_at: i.user?.created_at,
      user_id: i.user_id,
      college: i.college,
      phone_number: i.phone_number,
      start_date: i.start_date,
      gender: i.gender,
      end_date: i.end_date,
      stipend: i.stipend,
    }));

    return NextResponse.json(combined);
  } catch (err) {
    console.error("GET /interns error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { user_id, phone_number, college, gender, end_date, stipend } = body;

    const res = await client.mutate<UpdateInternResponse>({
      mutation: UPDATE_INTERN_BY_USER_ID,
      variables: { 
        user_id, 
        phone_number, 
        college, 
        gender, 
        end_date: end_date || null, 
        stipend: stipend ? parseInt(stipend.toString(), 10) : null 
      },
    });

    return NextResponse.json(res.data?.update_interns?.returning[0]);
  } catch (err) {
    console.error("PUT /interns error:", err);
    return NextResponse.json({ error: "Failed to update intern" }, { status: 500 });
  }
}