/**
 * Server Actions for Source & ImageCard Mutations
 *
 * All mutations enforce permission checks via getUserGuild() and
 * handle errors via centralized lib/error.ts patterns.
 *
 * Error handling:
 * - getUserGuild() throws if user lacks permission
 * - assertSnowflake() validates ID format
 * - handleServerError() + reportError() wraps operational errors
 * - Zod + MessageBuilder validate business logic
 */

"use server";

import { redirect } from "next/navigation";

import { deleteSession } from "./session";

/**
 * Redirect user to Discord OAuth2 login endpoint
 *
 * Side effects:
 * - Redirects to /api/auth/login
 *
 * @throws Redirect to /api/auth/login
 */
export async function signIn() {
  redirect("/api/auth/login");
}

/**
 * Sign out user and clear session
 *
 * Side effects:
 * - Deletes session from database
 * - Clears session cookie
 * - Redirects to home page
 *
 * @throws Redirect to home page
 */
export async function signOut() {
  await deleteSession();
  redirect("/");
}

