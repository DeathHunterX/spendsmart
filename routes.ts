/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/", "/about", "/contact", "/service"];

/**
 * An array of routes that are used for authentication
 * These routes will direct logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "sign-up", "/dashboard", "net-worth"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for PAI authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
