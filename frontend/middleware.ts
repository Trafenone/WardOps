import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login"];

const isPublicPath = (path: string): boolean =>
  publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;
  const isPathPublic = isPublicPath(path);
  const isAuthenticated = !!token;

  if (!isPathPublic && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  if (isPathPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).+)",
  ],
};
