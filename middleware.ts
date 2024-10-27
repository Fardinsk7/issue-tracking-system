import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decodeToken } from "./lib/decode-token";

export async function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;
  // const isPublicPath = path === "/auth";
  // const isNotVerifiedPath = path === "/notVerified";

  // const decoded = await decodeToken(request);
  
  // // If no token, redirect to auth
  // if (!isPublicPath && decoded === false) {
  //   return NextResponse.redirect(new URL("/auth", request.nextUrl));
  // }

  // // If user is logged in but not approved
  // if (decoded && decoded.userVerificationStatus !== "approve") {
  //   // Allow access to notVerified page
  //   if (isNotVerifiedPath) {
  //     return NextResponse.next();
  //   }
  //   // Redirect to notVerified page from anywhere else (including auth)
  //   return NextResponse.redirect(new URL("/notVerified", request.nextUrl));
  // }

  // // If user is logged in and approved
  // if (decoded && decoded.userVerificationStatus === "approve") {
  //   // Redirect from auth page to home
  //   if (isPublicPath) {
  //     return NextResponse.redirect(new URL("/home", request.nextUrl));
  //   }
  //   // Allow access to all other pages
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/home/fleets",
    "/home/tickets",
    "/home/products",
    "/home/issuee-tracking",
    "/home/master",
    "/home/driver",
    "/home/mxl-screen",
    "/home/vehicle",
    "/auth",
    "/issue-tracking",
    "/notVerified"
  ],
};