import { NextRequest, NextResponse } from "next/server";
import { Session } from "./lib/auth";
import { getMenu, MenuRole, route, setProtectedRoute } from "./lib/menu";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
    { headers: req.headers, method: "GET" },
  )
    .then((res) => res.json() as Promise<Session | null>)
    .catch(() => null);

  if (!session && !pathname.startsWith(route.auth)) {
    return NextResponse.redirect(new URL(route.auth, req.url));
  }

  if (session && pathname.startsWith(route.auth)) {
    return NextResponse.redirect(new URL(route.protected, req.url));
  }

  const menu = getMenu(pathname);
  const isRoleAllowed = (role: MenuRole[]) => {
    return role.some((r) => r === "all" || r === session?.user.role);
  };

  const isMenuRouteAndHaveAccess = !!menu && isRoleAllowed(menu.role);
  const isOtherRouteAndHaveAccess = route.other.some(({ href, role }) => {
    return pathname.startsWith(setProtectedRoute(href)) && isRoleAllowed(role);
  });

  if (
    !pathname.startsWith(route.auth) &&
    !isMenuRouteAndHaveAccess &&
    !isOtherRouteAndHaveAccess
  ) {
    return NextResponse.rewrite(new URL("/404", req.url));
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
