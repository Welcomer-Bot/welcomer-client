import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createDBSession } from "@/lib/dal/session";
import { requireEnv } from "@/lib/env";
import { createSession } from "@/lib/session";
import { timingSafeEqualString } from "@/lib/security";

function sanitizeRedirectPath(path: string | undefined) {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export async function handleOAuthCallback(input: {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}) {
  const cookieStore = await cookies();

  // Every exit path below either fails or completes the OAuth attempt tied to
  // this `oauthState` cookie, so it's always safe (and always correct) to
  // drop it here rather than repeating `cookieStore.delete(...)` at each call
  // site.
  function errorRedirect(error: string, errorDescription: string): never {
    cookieStore.delete("oauthState");
    const params = new URLSearchParams({
      error,
      error_description: errorDescription,
    });
    redirect(`/auth/error?${params.toString()}`);
  }

  if (input.error) {
    if (input.error === "access_denied") {
      cookieStore.delete("oauthState");
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
  if (!expectedState || !timingSafeEqualString(input.state, expectedState)) {
    errorRedirect("invalidState", "Invalid authentication state");
  }

  const redirectAfterLoginCookie = cookieStore.get("redirectAfterLogin")?.value;
  const targetUrl =
    sanitizeRedirectPath(redirectAfterLoginCookie) ?? "/dashboard";

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: requireEnv("NEXT_PUBLIC_DISCORD_CLIENT_ID"),
      client_secret: requireEnv("DISCORD_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code: input.code,
      redirect_uri: requireEnv("REDIRECT_URI"),
    }),
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
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
    refresh_token?: string;
  };

  if (
    typeof tokenData.access_token !== "string" ||
    typeof tokenData.expires_in !== "number" ||
    typeof tokenData.refresh_token !== "string"
  ) {
    errorRedirect(
      "invalid_token_response",
      "Unexpected token response from OAuth provider",
    );
  }

  const dbSession = await createDBSession({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
  });

  if (!dbSession) {
    errorRedirect("internalServerError", "Unable to create session");
  }

  await createSession(dbSession);
  cookieStore.delete("oauthState");
  cookieStore.delete("redirectAfterLogin");

  redirect(targetUrl);
}
