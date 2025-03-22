import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    return NextResponse.next();
  } catch (e) {
    console.error("Middleware error: ", e);
    return NextResponse.redirect(new URL("/error", origin));
  }
}

export const config = {
  matcher: [
    "/sign-in",
    "/dashboard/:path*",
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
