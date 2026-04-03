import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";

// ------------------- GraphQL Queries & Mutations -------------------

const GET_DEPARTMENTS = gql`
  query GetAllDepartments {
    departments {
      id
      name
    }
  }
`;

const INSERT_DEPARTMENT = gql`
  mutation InsertDepartment($object: departments_insert_input!) {
    insert_departments_one(object: $object) {
      id
      name
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: Int!, $changes: departments_set_input!) {
    update_departments_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
      name
    }
  }
`;

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: Int!) {
    delete_departments_by_pk(id: $id) {
      id
    }
  }
`;

// ------------------- TypeScript Interface -------------------

export interface Department {
  id: number;
  name: string;
}

type DeleteDepartmentResponse = {
  delete_departments_by_pk: {
    id: number;
  } | null;
};

// ------------------- API Handlers -------------------

// GET Departments
export async function GET() {
  // ── Auth: any authenticated user ──
  const { errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  try {
    const { data } = await client.query<{ departments: Department[] }>({
      query: GET_DEPARTMENTS,
      fetchPolicy: "network-only",
    });
    return NextResponse.json({ departments: data?.departments ?? [] });
  } catch (err) {
    console.error("GET /departments error:", err);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

// CREATE Department
export async function POST(req: Request) {
  // ── Auth: admin only ──
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const body: Omit<Department, "id"> = await req.json();
    const { data } = await client.mutate<{ insert_departments_one: Department }>({
      mutation: INSERT_DEPARTMENT,
      variables: { object: body },
    });
    return NextResponse.json({ department: data?.insert_departments_one });
  } catch (err) {
    console.error("POST /departments error:", err);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}

// UPDATE Department
export async function PUT(req: Request) {
  // ── Auth: admin only ──
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const body: { id: number; name?: string } = await req.json();
    const { id, ...changes } = body;
    const { data } = await client.mutate<{ update_departments_by_pk: Department }>({
      mutation: UPDATE_DEPARTMENT,
      variables: { id, changes },
    });
    return NextResponse.json({ department: data?.update_departments_by_pk });
  } catch (err) {
    console.error("PUT /departments error:", err);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

// DELETE Department
export async function DELETE(req: Request) {
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const { id }: { id: number } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Department id required" }, { status: 400 });
    }

    const { data } = await client.mutate<DeleteDepartmentResponse>({
  mutation: DELETE_DEPARTMENT,
  variables: { id: id },
});

    if (!data?.delete_departments_by_pk) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    return NextResponse.json({ id });

  } catch (err) {
    console.error("DELETE /departments error:", err);
    return NextResponse.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}