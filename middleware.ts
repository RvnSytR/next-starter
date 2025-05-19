import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { route } from "./lib/menu";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie && !pathname.startsWith(route.auth)) {
    return NextResponse.redirect(new URL(route.auth, req.url));
  }

  if (sessionCookie && pathname.startsWith(route.auth)) {
    return NextResponse.redirect(new URL(route.protected, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth",
    "/dashboard/:path*",

    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
