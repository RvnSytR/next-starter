import { NextRequest, NextResponse } from "next/server";
import { Session } from "./lib/auth";
import { getMenu, MenuRole, route } from "./lib/menu";

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

  const isHasMenuAndHaveAccess = !!menu && isRoleAllowed(menu.role);
  const isOtherRouteAndHaveAccess = route.other.some(
    ({ href, role }) =>
      pathname.startsWith(`${route.protected}${href}`) && isRoleAllowed(role),
  );

  if (
    !pathname.startsWith(route.auth) &&
    !isHasMenuAndHaveAccess &&
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
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
