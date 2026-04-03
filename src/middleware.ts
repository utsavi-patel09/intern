import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Route Protection Middleware
// ─────────────────────────────────────────────────────────────────────────────
// This middleware intercepts all requests matching the `config.matcher` patterns
// and enforces two layers of security:
//
//   1. AUTHENTICATION — Unauthenticated users are redirected to /login.
//   2. AUTHORIZATION  — Authenticated users can only access routes that belong
//                       to their role. Attempting to access another role's
//                       routes will redirect them to their own dashboard.
//
// Route structure:
//   /admin/*     → admin only
//   /manager/*   → manager only
//   /intern/*    → intern only
//   /login       → unauthenticated users only (logged-in users are redirected)
// ─────────────────────────────────────────────────────────────────────────────

/** Maps each role to its home/dashboard page */
const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  intern: "/intern",
};

/** Maps each role to the route prefix it is allowed to access */
const ROLE_PREFIX: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  intern: "/intern",
};

/** All protected route prefixes (the union of all role prefixes) */
const PROTECTED_PREFIXES = Object.values(ROLE_PREFIX);

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // ── 1. Redirect logged-in users AWAY from /login ───────────────────────
  if (pathname === "/login") {
    if (token?.role) {
      const home = ROLE_HOME[token.role as string] ?? "/";
      return NextResponse.redirect(new URL(home, req.url));
    }
    // Not logged in → allow access to login page
    return NextResponse.next();
  }

  // ── 2. Unauthenticated users trying to access protected routes → /login ─
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    // Preserve the original destination so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based authorization ────────────────────────────────────────
  if (isProtected && token) {
    const role = token.role as string;
    const allowedPrefix = ROLE_PREFIX[role];

    // If the user's role doesn't have a mapping or the path doesn't match
    // their allowed prefix, redirect them to their own dashboard.
    if (!allowedPrefix || !pathname.startsWith(allowedPrefix)) {
      const home = ROLE_HOME[role] ?? "/login";
      return NextResponse.redirect(new URL(home, req.url));
    }
  }

  // ── 4. All checks passed — allow the request ──────────────────────────
  return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────────────────────
// Matcher: Only run this middleware on these route patterns.
// Static assets, _next internals, and API routes are excluded by default.
// ─────────────────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/manager/:path*",
    "/intern/:path*",
  ],
};
