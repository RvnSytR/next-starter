import { getMenu, path } from "@/lib/menu";
import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { data, error } = await authClient.getSession({
    fetchOptions: { headers: req.headers },
  });

  if (error) console.error("Error fetching session: ", error);
  if (!data && !pathname.startsWith(path.auth)) {
    console.warn("No user data found in session.");
    return NextResponse.redirect(new URL(path.auth, req.url));
  }

  if (data && pathname.startsWith(path.auth)) {
    return NextResponse.redirect(new URL(path.protected, req.url));
  }

  const menu = getMenu(pathname, true);
  if (menu && !menu.role.some((r) => r === "all" || r === data?.user.role)) {
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
