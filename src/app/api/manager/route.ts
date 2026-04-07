// ================= API =================
import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";

// ================= MANAGER QUERY =================
const GET_MANAGER = gql`
  query GetManager($id: Int!) {
    users_by_pk(id: $id) {
      id
      name
      email
      role
    }
    managers(where: { user_id: { _eq: $id } }) {
      department {
        id
        name
      }
    }
  }
`;

// ================= INTERNS QUERY =================
const GET_INTERNS = gql`
  query GetInternsByDepartment($departmentId: Int!) {
    interns(where: { department_id: { _eq: $departmentId } }) {
      id
      college
      phone_number
      start_date
      user {
        id
        name
        email
      }
      department {
        name
      }
    }
  }
`;

// ================= TYPES =================
interface Manager {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DepartmentData {
  id: number;
  name: string;
}

interface GetManagerResponse {
  users_by_pk: Manager | null;
  managers: { department: DepartmentData }[];
}

interface InternUser {
  id: number;
  college: string;
  phone_number: string;
  start_date: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  department: { name: string };
}

interface GetInternsResponse {
  interns: InternUser[];
}



// ================= API =================
export async function GET(req: Request) {

  // ── Auth: admin or manager only ──
  const { session, errorResponse } = await requireAuth(["admin", "manager"]);
  if (errorResponse) return errorResponse;

  const userId = session.user.id;   // ✅ take id from session

  try {

    // ===== Fetch Manager =====
    const managerResult = await client.query<GetManagerResponse>({
      query: GET_MANAGER,
      variables: { id: userId },
      fetchPolicy: "network-only",
    });

    const managerData = managerResult.data?.users_by_pk;
    const managerDepartment = managerResult.data?.managers?.[0]?.department;

    if (!managerData) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 404 }
      );
    }

    if (!managerDepartment) {
      return NextResponse.json(
        { error: "Manager does not have an assigned department" },
        { status: 404 }
      );
    }

    // ===== Fetch Interns =====
    const internsResult = await client.query<GetInternsResponse>({
      query: GET_INTERNS,
      variables: { departmentId: managerDepartment.id },
      fetchPolicy: "network-only",
    });

    const internsRaw = internsResult.data?.interns || [];

    const interns = internsRaw.map((u) => ({
      id: u.user.id,
      name: u.user.name,
      email: u.user.email,
      department: u.department.name,
      college: u.college ?? "",
      phone_number: u.phone_number ?? "",
      start_date: u.start_date ?? "",
    }));

    const manager = {
      id: managerData.id,
      name: managerData.name,
      email: managerData.email,
      role: managerData.role,
      department: managerDepartment.name,
    };

    return NextResponse.json({ manager, interns });

  } catch (err) {
    console.error("Manager API error:", err);

    return NextResponse.json(
      { error: "Failed to fetch manager data" },
      { status: 500 }
    );
  }
}