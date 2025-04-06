import { NextRequest, NextResponse } from "next/server";
import { Session } from "./lib/auth";
import { getMenu, route } from "./lib/menu";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const storedSession = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
    { method: "GET", headers: req.headers },
  )
    .then((res) => res.json() as Promise<Session | null>)
    .catch(() => null);

  if (!storedSession && !pathname.startsWith(route.auth)) {
    console.warn("No user data found in session.");
    return NextResponse.redirect(new URL(route.auth, req.url));
  }

  if (storedSession && pathname.startsWith(route.auth)) {
    return NextResponse.redirect(new URL(route.protected, req.url));
  }

  const menu = getMenu(pathname, true);
  if (
    (!menu && !pathname.startsWith(route.auth)) ||
    (menu &&
      !menu.role.some((r) => r === "all" || r === storedSession?.user.role))
  ) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth",
    "/dashboard/:path*",
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
