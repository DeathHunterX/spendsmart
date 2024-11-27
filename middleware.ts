import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import {
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/constants/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(
  req: any
): Promise<Response | void> {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnSignInPage = nextUrl.pathname === AUTH_ROUTES.SIGN_IN;
  const isDefaultRedirect = nextUrl.pathname === DEFAULT_LOGIN_REDIRECT;

  //   console.log("isLoggedIn: ", isLoggedIn);
  //   console.log("isApiAuthRoute: ", isApiAuthRoute);
  //   console.log("isPublicRoute: ", isPublicRoute);
  //   console.log("isAuthRoute: ", isAuthRoute);
  //   console.log("isSignInPage: ", isSignInPage);
  //   console.log("isDefaultRedirect: ", isDefaultRedirect);

  if (isApiAuthRoute) {
    // Allow API auth routes to proceed
    return;
  }

  /**
   * Case:
   *    -
   */

  if (isAuthRoute && isLoggedIn && !isDefaultRedirect) {
    // Redirect authenticated users away from auth routes (e.g., login page)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute && !isOnSignInPage) {
    // Redirect unauthenticated users to the sign-in page if they try to access non-public routes
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  if (isLoggedIn && isOnSignInPage) {
    // If the user is logged in and they try to access the sign-in page, redirect them to the dashboard
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
