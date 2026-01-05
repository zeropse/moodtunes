import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "sign-in") {
      const { email, password } = body;

      // Mock validation
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Mock user creation
      const user = { id: "1", email, name: email.split("@")[0] };

      // Create response with user data
      const response = NextResponse.json({ user });

      // Set httpOnly cookie for authentication
      response.cookies.set("auth", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    if (action === "sign-up") {
      const { name, email, password } = body;

      // Mock validation
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Mock user creation
      const user = { id: "1", email, name };

      // Create response with user data
      const response = NextResponse.json({ user });

      // Set httpOnly cookie for authentication
      response.cookies.set("auth", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    if (action === "logout") {
      // Create response
      const response = NextResponse.json({ success: true });

      // Clear the auth cookie
      response.cookies.set("auth", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
