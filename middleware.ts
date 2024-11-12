import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(
  req: any
): Promise<Response | void> {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isSignInPage = nextUrl.pathname === "/sign-in";
  const isDefaultRedirect = nextUrl.pathname === DEFAULT_LOGIN_REDIRECT;

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute && isLoggedIn && !isDefaultRedirect) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute && !isSignInPage) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
