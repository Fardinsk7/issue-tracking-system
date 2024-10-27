import { NextResponse, NextRequest } from "next/server";
import { USER_TOKEN } from "@/utils/jwt";

export async function POST(req: NextRequest) {
  try {
    // Create response object
    const response = NextResponse.json(
      { status: "success", message: "Logged out successfully" },
      { status: 200 }
    );

    // Remove the cookie
    response.cookies.delete(USER_TOKEN);

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "failed", error: "Could not logout" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if the token cookie exists
    const token = req.cookies.get(USER_TOKEN);
    
    return NextResponse.json({
      status: "success",
      isLoggedIn: !!token
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "failed", error: "Could not check login status" },
      { status: 500 }
    );
  }
}