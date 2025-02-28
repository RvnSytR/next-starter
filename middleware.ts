import { GetMenu, path } from "@/lib/menu";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const { login: loginPath, protected: protectedPath } = path;

  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const menu = GetMenu(pathname, true);

    if (!token && !pathname.startsWith(loginPath)) {
      const cookieStore = await cookies();
      const authCookieName = "authjs.session-token";
      if (cookieStore.get(authCookieName)) cookieStore.delete(authCookieName);
      return Response.redirect(new URL(loginPath, origin));
    }

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
