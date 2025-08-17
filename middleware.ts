import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { dashboardRoute, signInRoute } from "./lib/routes";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const sessionCookie = getSessionCookie(req);

  if (!sessionCookie && !pathname.startsWith(signInRoute)) {
    return NextResponse.redirect(new URL(signInRoute, req.url));
  }

  if (sessionCookie && pathname.startsWith(signInRoute)) {
    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  }

  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-url", req.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/sign-in",
    "/dashboard/:path*",

    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
