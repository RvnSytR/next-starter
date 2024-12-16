import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { GetMenu, path } from "./components/content";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const { login: loginPath, protected: protectedPath } = path;

  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const menu = GetMenu(pathname, true);

    if (!token && !pathname.startsWith(loginPath))
      return Response.redirect(new URL(loginPath, origin));

    if (token && pathname.startsWith(loginPath))
      return Response.redirect(new URL(protectedPath, origin));

    if (token && menu && menu.role !== "all" && menu.role !== token.role)
      return NextResponse.rewrite(new URL("/404", origin));

    return NextResponse.next();
  } catch (e) {
    console.error("Middleware error: ", e);
    return NextResponse.redirect(new URL("/error", origin));
  }
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
