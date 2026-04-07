import { NextResponse } from "next/server";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ---------------------- GraphQL Queries & Mutations ----------------------

const GET_USERS = gql`
  query GetAllUsers($limit: Int!, $offset: Int!, $where: users_bool_exp!) {
    users_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    users(limit: $limit, offset: $offset, where: $where, order_by: { created_at: desc }) {
      id
      name
      email
      role
      created_at
      intern {
        college
        gender
        end_date
        stipend
        department {
          id
          name
        }
      }
    }
    managers {
      user_id
      department {
        id
        name
      }
    }
  }
`;

const INSERT_USER = gql`
  mutation InsertUser($object: users_insert_input!) {
    insert_users_one(object: $object) {
      id
      name
      email
      role
      created_at
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $changes: users_set_input!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
      name
      email
      role
      created_at
    }
  }
`;

const INSERT_INTERN = gql`
  mutation InsertIntern($object: interns_insert_input!) {
    insert_interns_one(object: $object) {
      id
      user_id
    }
  }
`;

const INSERT_MANAGER = gql`
  mutation InsertManager($object: managers_insert_input!) {
    insert_managers_one(object: $object) {
      id
      user_id
    }
  }
`;

const UPDATE_INTERN = gql`
  mutation UpdateIntern(
    $user_id: Int!, 
    $college: String, 
    $department_id: Int, 
    $gender: String, 
    $end_date: date, 
    $stipend: Int
  ) {
    update_interns(
      where: { user_id: { _eq: $user_id } },
      _set: { 
        college: $college, 
        department_id: $department_id, 
        gender: $gender, 
        end_date: $end_date, 
        stipend: $stipend 
      }
    ) {
      affected_rows
    }
  }
`;

const UPDATE_MANAGER = gql`
  mutation UpdateManager($user_id: Int!, $department_id: Int) {
    update_managers(
      where: { user_id: { _eq: $user_id } },
      _set: { department_id: $department_id }
    ) {
      affected_rows
    }
  }
`;

const DELETE_INTERN = gql`
  mutation DeleteIntern($user_id: Int!) {
    delete_interns(where: { user_id: { _eq: $user_id } }) {
      affected_rows
    }
  }
`;

const DELETE_MANAGER = gql`
  mutation DeleteManager($user_id: Int!) {
    delete_managers(where: { user_id: { _eq: $user_id } }) {
      affected_rows
    }
  }
`;

const CHECK_EMAIL = gql`
  query CheckEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
    }
  }
`;

// ---------------------- GET Users ----------------------

export async function GET(req: Request) {
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || "";
    const activeRole = url.searchParams.get("role") || "all";

    const offset = (page - 1) * limit;

    const where: any = {
      _and: [{ role: { _neq: "admin" } }]
    };

    if (activeRole !== "all") {
      where._and.push({ role: { _eq: activeRole } });
    }

    if (search) {
      where._and.push({
        _or: [
          { name: { _ilike: `%${search}%` } },
          { email: { _ilike: `%${search}%` } }
        ]
      });
    }

    const { data } = await client.query<{
      users: any[];
      managers: any[];
      users_aggregate: { aggregate: { count: number } };
    }>({
      query: GET_USERS,
      variables: { limit, offset, where },
      fetchPolicy: "network-only",
    });

    const totalCount = data?.users_aggregate?.aggregate?.count || 0;

    const managersMap = new Map();
    data?.managers?.forEach((m: any) => {
      managersMap.set(m.user_id, m.department?.id || null);
    });

    const mappedUsers = data?.users?.map((u: any) => {
      let deptId = null;
      if (u.role === 'intern') {
        deptId = u.intern?.department?.id || null;
      } else if (u.role === 'manager') {
        deptId = managersMap.get(u.id) || null;
      }
      return {
        ...u,
        department_id: deptId,
      };
    });

    return NextResponse.json({ 
      users: mappedUsers ?? [],
      totalCount,
      page,
      limit
    });
  } catch (err) {
    console.error("GET /users error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// ---------------------- CREATE User ----------------------

export async function POST(req: Request) {
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { 
      name, email, password, role, 
      college, department_id, gender, end_date, stipend 
    } = body;

    // 1. Check if email exists
    const { data: emailData } = await client.query<{ users: any[] }>({
      query: CHECK_EMAIL,
      variables: { email },
      fetchPolicy: "no-cache",
    });

    if (emailData?.users && emailData.users.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 2. Hash Password (NEW)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    const { data: userData } = await client.mutate<{ insert_users_one: any }>({
      mutation: INSERT_USER,
      variables: {
        object: { name, email, password: hashedPassword, role }
      },
    });

    const newUser = userData?.insert_users_one;
    if (!newUser) throw new Error("Failed to create user record");

    // 3. Create Role-Specific Record
    if (role === "intern") {
      await client.mutate({
        mutation: INSERT_INTERN,
        variables: {
          object: {
            user_id: newUser.id,
            college: college || "Not Specified",
            department_id: department_id || null,
            gender: gender || null,
            end_date: end_date || null,
            stipend: stipend ? parseInt(stipend.toString(), 10) : null,
            phone_number: "Not Assigned",
            start_date: new Date().toISOString().split('T')[0]
          }
        }
      });
    } else if (role === "manager") {
      await client.mutate({
        mutation: INSERT_MANAGER,
        variables: {
          object: {
            user_id: newUser.id,
            department_id: department_id || null
          }
        }
      });
    }

    return NextResponse.json({ user: newUser });
  } catch (err) {
    console.error("POST /users error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// ---------------------- UPDATE User ----------------------

export async function PUT(req: Request) {
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { 
      id, name, email, password, role, 
      college, department_id, gender, end_date, stipend 
    } = body;

    // 1. Get current state
    const { data: currentData } = await client.query<{ users_by_pk: any }>({
      query: gql`
        query GetUser($id: Int!) {
          users_by_pk(id: $id) {
            id
            role
            email
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache",
    });

    const currentUser = currentData?.users_by_pk;
    if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Check email if changed
    if (email !== currentUser.email) {
      const { data: emailData } = await client.query<{ users: any[] }>({
        query: CHECK_EMAIL,
        variables: { email },
        fetchPolicy: "no-cache",
      });
      if (emailData?.users && emailData.users.length > 0) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
    }

    // 3. Update User record
    const userChanges: any = { name, email, role };
    if (password) {
      userChanges.password = await bcrypt.hash(password, 10);
    }

    const { data: updatedUserData } = await client.mutate<{ update_users_by_pk: any }>({
      mutation: UPDATE_USER,
      variables: { id, changes: userChanges },
    });

    const updatedUser = updatedUserData?.update_users_by_pk;

    // 4. Update Role-Specific Logic
    const roleChanged = role !== currentUser.role;

    if (roleChanged) {
      // Delete old role records
      if (currentUser.role === "intern") await client.mutate({ mutation: DELETE_INTERN, variables: { user_id: id } });
      if (currentUser.role === "manager") await client.mutate({ mutation: DELETE_MANAGER, variables: { user_id: id } });

      // Create new role records
      if (role === "intern") {
        await client.mutate({
          mutation: INSERT_INTERN,
          variables: {
            object: {
              user_id: id,
              college: college || "Not Specified",
              department_id: department_id || null,
              gender: gender || null,
              end_date: end_date || null,
              stipend: stipend ? parseInt(stipend.toString(), 10) : null,
              phone_number: "Not Assigned",
              start_date: new Date().toISOString().split('T')[0]
            }
          }
        });
      } else if (role === "manager") {
        await client.mutate({
          mutation: INSERT_MANAGER,
          variables: {
            object: {
              user_id: id,
              department_id: department_id || null
            }
          }
        });
      }
    } else {
      // Role didn't change, just update existing record
      if (role === "intern") {
        await client.mutate({
          mutation: UPDATE_INTERN,
          variables: {
            user_id: id,
            college,
            department_id,
            gender,
            end_date: end_date || null,
            stipend: stipend ? parseInt(stipend.toString(), 10) : null
          }
        });
      } else if (role === "manager") {
        await client.mutate({
          mutation: UPDATE_MANAGER,
          variables: { user_id: id, department_id }
        });
      }
    }

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("PUT /users error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// ---------------------- DELETE User ----------------------

export async function DELETE(req: Request) {
  const { errorResponse } = await requireAuth(["admin"]);
  if (errorResponse) return errorResponse;

  try {
    const { id } = await req.json();

    // Cascading delete is handled in DB schema (REFERENCES users ON DELETE CASCADE),
    // but we can be explicit if needed.
    
    const { data } = await client.mutate<{ delete_users_by_pk: { id: number } }>({
      mutation: gql`
        mutation DeleteUser($id: Int!) {
          delete_users_by_pk(id: $id) {
            id
          }
        }
      `,
      variables: { id },
    });

    return NextResponse.json({ id: data?.delete_users_by_pk?.id });
  } catch (err) {
    console.error("DELETE /users error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}