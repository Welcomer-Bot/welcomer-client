import { NextRequest, NextResponse } from "next/server";

import { decrypt, getSession } from "@/lib/session";

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const session = getSession();
  const sessionData = await decrypt(session);

  if (isProtectedRoute && !sessionData?.userId) {
    return NextResponse.redirect(new URL("/api/auth/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
