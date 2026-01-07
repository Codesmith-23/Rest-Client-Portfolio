import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_visit_token");

  // 1. If a valid session cookie exists, DO NOT COUNT.
  if (sessionToken) {
    // Get current count without incrementing
    try {
      const count = await kv.get<number>("portfolio_visits") || 0;
      return NextResponse.json({ count, message: "Active session - ignored" });
    } catch (error) {
      console.error('KV Error:', error);
      return NextResponse.json({ count: 1024, message: "Active session - ignored" });
    }
  }

  // 2. New Session Detected
  try {
    // Increment Database
    const count = await kv.incr("portfolio_visits");

    // 3. Set a Cookie that expires in 30 MINUTES
    // 30 mins * 60 seconds = 1800 seconds
    const cookieStore2 = await cookies();
    cookieStore2.set("session_visit_token", "active", {
      maxAge: 1800, // 30 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json({ count, message: "Session Started" });
  } catch (error) {
    console.error('KV Error:', error);
    return NextResponse.json({ count: 1024, error: "KV Error" });
  }
}
