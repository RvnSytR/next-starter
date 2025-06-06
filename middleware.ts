import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { route } from "./lib/const";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie && !pathname.startsWith(route.signIn)) {
    return NextResponse.redirect(new URL(route.signIn, req.url));
  }

  if (sessionCookie && pathname.startsWith(route.signIn)) {
    return NextResponse.redirect(new URL(route.protected, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/dashboard/:path*",

    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
