import { NextResponse } from "next/server";

export async function POST() {
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
