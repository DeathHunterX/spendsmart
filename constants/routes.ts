/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes: Array<string> = [
  "/",
  "/about",
  "/contact",
  "/service",
  "/sign-in",
  "/sign-up",
  "/new-verification",
];

/**
 * An array of routes that are used for authentication
 * These routes will direct logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes: Array<string> = ["/dashboard", "net-worth"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for PAI authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";

/**
 * The default redirect path in authentication pages
 * @type {string}
 */
export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};
