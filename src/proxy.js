import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isAppData = nextUrl.pathname.startsWith("/app");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  // Protect /app/* and /api/* (except for auth routes)
  if ((isAppData || (isApiRoute && !isAuthRoute)) && !isLoggedIn) {
    if (isApiRoute) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
    return Response.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
