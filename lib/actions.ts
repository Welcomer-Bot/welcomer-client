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

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createDBSession } from "./dal/session";
import { AppError, ErrorCode } from "./error";
import { createSession, deleteSession } from "./session";

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

function requireOAuthEnv(
  name:
    | "NEXT_PUBLIC_DISCORD_CLIENT_ID"
    | "DISCORD_CLIENT_SECRET"
    | "REDIRECT_URI",
) {
  const value = process.env[name];
  if (!value) {
    throw new AppError(
      `Missing required environment variable: ${name}`,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      { env: name },
    );
  }
  return value;
}

function sanitizeRedirectPath(path: string | undefined) {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

function errorRedirect(error: string, errorDescription: string): never {
  const params = new URLSearchParams({
    error,
    error_description: errorDescription,
  });
  redirect(`/auth/error?${params.toString()}`);
}

export async function handleOAuthCallback(input: {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}) {
  const cookieStore = await cookies();

  if (input.error) {
    if (input.error === "access_denied") {
      redirect("/");
    }
    errorRedirect(
      input.error,
      input.errorDescription ?? "An error occurred during authentication",
    );
  }

  if (!input.code) {
    errorRedirect("codeMissing", "The authorization code is missing");
  }

  if (!input.state) {
    errorRedirect("stateMissing", "The state parameter is missing");
  }

  const expectedState = cookieStore.get("oauthState")?.value;
  if (!expectedState || input.state !== expectedState) {
    cookieStore.delete("oauthState");
    errorRedirect("invalidState", "Invalid authentication state");
  }

  const redirectAfterLoginCookie = cookieStore.get("redirectAfterLogin")?.value;
  const targetUrl =
    sanitizeRedirectPath(redirectAfterLoginCookie) ?? "/dashboard";

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: requireOAuthEnv("NEXT_PUBLIC_DISCORD_CLIENT_ID"),
      client_secret: requireOAuthEnv("DISCORD_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code: input.code,
      redirect_uri: requireOAuthEnv("REDIRECT_URI"),
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    errorRedirect(
      "invalid_grant",
      "The authorization code is invalid or expired",
    );
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (
    typeof tokenData.access_token !== "string" ||
    typeof tokenData.expires_in !== "number"
  ) {
    errorRedirect(
      "invalid_token_response",
      "Unexpected token response from OAuth provider",
    );
  }

  const dbSession = await createDBSession(
    tokenData.access_token,
    tokenData.expires_in,
  );

  if (!dbSession) {
    errorRedirect("internalServerError", "Unable to create session");
  }

  await createSession(dbSession);
  cookieStore.delete("oauthState");
  cookieStore.delete("redirectAfterLogin");

  redirect(targetUrl);
}

