import { NextRequest, NextResponse } from "next/server";

import { decrypt, getSession } from "@/lib/session";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");

  const session = await getSession();
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
