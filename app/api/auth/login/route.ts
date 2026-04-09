import { NextResponse } from "next/server";

import { AppError, ErrorCode } from "@/lib/error";

/**
 * Require environment variable, throw structured AppError if missing
 *
 * @param name - Environment variable name
 * @throws AppError with INTERNAL_SERVER_ERROR if variable not set
 * @returns Environment variable value
 */
function requireEnv(name: "NEXT_PUBLIC_DISCORD_CLIENT_ID" | "REDIRECT_URI") {
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

const isProduction = process.env.NODE_ENV === "production";

export async function GET() {
  const DISCORD_CLIENT_ID = requireEnv("NEXT_PUBLIC_DISCORD_CLIENT_ID");
  const REDIRECT_URI = requireEnv("REDIRECT_URI");
  const state = crypto.randomUUID();
  const scope = "identify guilds";
  const discordAuthUrl = new URL("https://discord.com/api/oauth2/authorize");
  discordAuthUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
  discordAuthUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  discordAuthUrl.searchParams.set("response_type", "code");
  discordAuthUrl.searchParams.set("scope", scope);
  discordAuthUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(discordAuthUrl);
  response.cookies.set("oauthState", state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
