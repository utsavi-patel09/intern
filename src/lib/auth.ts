import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";



/**
 * Validates that the current request has an active session.
 * Optionally checks that the user's role is in the `allowedRoles` list.
 *
 * @param allowedRoles - If provided, the user must have one of these roles.
 *                       Pass an empty array or omit to only require authentication.
 * @returns An object with either a valid `session` or an `errorResponse` to return.
 */
export async function requireAuth(allowedRoles?: string[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized — please sign in" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.role;
    if (!allowedRoles.includes(userRole)) {
      return {
        session: null,
        errorResponse: NextResponse.json(
          { error: "Forbidden — you do not have permission to access this resource" },
          { status: 403 }
        ),
      };
    }
  }

  return { session, errorResponse: null };
}
