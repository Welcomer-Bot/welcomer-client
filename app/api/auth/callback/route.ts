import { NextRequest, NextResponse } from "next/server";

import { AppError, ErrorCode } from "@/lib/error";
import { createDBSession } from "@/lib/dal/session";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * Require environment variable, throw structured AppError if missing
 *
 * @param name - Environment variable name
 * @throws AppError with INTERNAL_SERVER_ERROR if variable not set
 * @returns Environment variable value
 */
function requireEnv(
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
      { env: name }
    );
  }
  return value;
}

function authErrorRedirect(
  request: NextRequest,
  error: string,
  errorDescription: string,
) {
  const errorUrl = new URL("/auth/error", request.nextUrl.origin);
  errorUrl.searchParams.set("error", error);
  errorUrl.searchParams.set("error_description", errorDescription);
  return NextResponse.redirect(errorUrl);
}

function sanitizeRedirectPath(path: string | undefined) {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription =
    searchParams.get("error_description") ??
    "An error occurred during authentication";

  if (error) {
    if (error === "access_denied") {
      return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }
    return authErrorRedirect(request, error, errorDescription);
  }

  if (!code) {
    return authErrorRedirect(
      request,
      "codeMissing",
      "The authorization code is missing",
    );
  }

  if (!state) {
    return authErrorRedirect(request, "stateMissing", "The state parameter is missing");
  }

  const expectedState = cookieStore.get("oauthState")?.value;
  if (!expectedState || state !== expectedState) {
    const response = authErrorRedirect(
      request,
      "invalidState",
      "Invalid authentication state",
    );
    response.cookies.delete("oauthState");
    return response;
  }

  const redirectAfterLoginCookie = cookieStore.get("redirectAfterLogin")?.value;
  const redirectUrl = sanitizeRedirectPath(redirectAfterLoginCookie) ?? "/dashboard";

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: requireEnv("NEXT_PUBLIC_DISCORD_CLIENT_ID"),
        client_secret: requireEnv("DISCORD_CLIENT_SECRET"),
        grant_type: "authorization_code",
        code,
        redirect_uri: requireEnv("REDIRECT_URI"),
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description: "The authorization code is invalid or expired",
        },
        { status: 400 },
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
      return NextResponse.json(
        {
          error: "invalid_token_response",
          error_description: "Unexpected token response from OAuth provider",
        },
        { status: 502 },
      );
    }

    const dbSession = await createDBSession(
      tokenData.access_token,
      tokenData.expires_in,
    );

    if (!dbSession) {
      return NextResponse.json(
        {
          error: "internalServerError",
          error_description: "Unable to create session",
        },
        { status: 500 },
      );
    }

    await createSession(dbSession);

    const response = NextResponse.json(
      {
        success: true,
        redirectUrl,
      },
      { status: 200 },
    );

    response.cookies.delete("oauthState");
    response.cookies.delete("redirectAfterLogin");
    return response;
  } catch {
    return NextResponse.json(
      {
        error: "internalServerError",
        error_description: "An internal server error occurred",
      },
      { status: 500 },
    );
  }

}
