import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect /app/* and /api/* routes with authentication
  if (
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/api/")
  ) {
    // Allow sign-in and sign-up endpoints
    if (
      pathname === "/api/sign-in" ||
      pathname === "/api/sign-up" ||
      pathname === "/api/logout"
    ) {
      return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get("auth");
    if (!authCookie) {
      if (pathname.startsWith("/api/")) {
        // Return 401 for API routes
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      } else {
        // Redirect to sign-up for app routes
        return NextResponse.redirect(new URL("/sign-up", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*", "/api/:path*"],
};
