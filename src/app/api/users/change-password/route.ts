import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { requireAuth } from "@/lib/auth";

const GET_USER = gql`
  query GetUser($id: Int!) {
    users_by_pk(id: $id) {
      id
      password
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($id: Int!, $password: String!) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { password: $password }
    ) {
      id
    }
  }
`;

export async function PUT(req: Request) {
  // ── Auth: any authenticated user ──
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { current_password, new_password } = await req.json();

    interface UserQueryResult {
      users_by_pk: {
        id: number;
        password: string;
      }
    }

    // 1️⃣ Get user
    const { data } = await client.query<UserQueryResult>({
      query: GET_USER,
      variables: { id: userId },
    });

    const user = data?.users_by_pk;

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    // 2️⃣ Check password
    const match = await bcrypt.compare(current_password, user.password);

    if (!match) {
      return NextResponse.json({ error: "Incorrect current password" });
    }

    // 3️⃣ Hash new password
    const hashed = await bcrypt.hash(new_password, 10);

    // 4️⃣ Update password
    await client.mutate({
      mutation: UPDATE_PASSWORD,
      variables: {
        id: userId,
        password: hashed,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" });
  }
}