import "server-only";

import { AppError, ErrorCode } from "@/lib/error";

/**
 * Env vars validated through {@link requireEnv}. Kept as a literal union
 * (rather than `string`) so a typo in the name is caught at compile time.
 */
export type RequiredEnvVar =
  | "NEXT_PUBLIC_DISCORD_CLIENT_ID"
  | "DISCORD_CLIENT_SECRET"
  | "REDIRECT_URI"
  | "SESSION_SECRET"
  | "TOKEN_ENCRYPTION_KEY";

/**
 * Require an environment variable, throwing a structured `AppError` if unset.
 *
 * Shared by the OAuth login/callback routes and the session module so there
 * is a single place that defines "missing env var" behavior. This does not
 * make validation eager/at-boot: each call site still only runs when its
 * module is first loaded or its route first hit.
 *
 * Not used by `lib/discord/rest.ts`: that module must not throw at import
 * time (see the comment there) so it validates DISCORD_BOT_TOKEN separately.
 *
 * @throws AppError with INTERNAL_SERVER_ERROR if the variable is not set
 */
export function requireEnv(name: RequiredEnvVar): string {
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
