import "server-only";

import {requireEnv} from "@/lib/env";

/**
 * Error thrown when a Discord OAuth token request (refresh or revoke) fails.
 *
 * Discord's OAuth token endpoints report failures using the standard RFC
 * 6749 `{ error, error_description }` envelope -- NOT the `{ code, message }`
 * shape used elsewhere by Discord's REST API -- so this carries that shape
 * explicitly rather than reusing a generic Discord API error type.
 *
 * `message` is a static, generic string: it never includes the token or the
 * raw `error_description`, so this error is always safe to log.
 */
export class DiscordTokenError extends Error {
  /** HTTP status code returned by Discord. */
  readonly status: number;
  /**
   * RFC 6749 error code (e.g. "invalid_grant"), when Discord returned a
   * parseable error body. Callers should branch on this -- in particular,
   * `"invalid_grant"` means the refresh token is permanently dead and the
   * user must re-authenticate, as opposed to a transient failure.
   */
  readonly error: string | undefined;
  /** Human-readable detail from Discord, when present. */
  readonly errorDescription: string | undefined;

  constructor(status: number, error?: string, errorDescription?: string) {
    super(`Discord OAuth token request failed with status ${status}`);
    this.name = "DiscordTokenError";
    this.status = status;
    this.error = error;
    this.errorDescription = errorDescription;
  }
}

/**
 * Discord's error response body for the OAuth token endpoints (RFC 6749
 * envelope). Distinct from Discord's usual `{ code, message }` REST shape.
 */
interface DiscordTokenErrorBody {
  error?: string;
  error_description?: string;
}

/** Discord's success response body for a `refresh_token` grant. */
interface DiscordRefreshTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * Exchange a Discord OAuth refresh token for a new access token.
 *
 * POSTs form-urlencoded to Discord's token endpoint with
 * `grant_type=refresh_token`, using the same client_id/client_secret body
 * auth as the `authorization_code` exchange in `lib/auth/oauth-callback.ts`.
 *
 * Discord does not document whether the returned `refresh_token` rotates on
 * refresh. To stay correct either way, callers MUST persist whatever
 * `refreshToken` comes back here -- that's why it's a required field of the
 * return type rather than an optional passthrough of the input.
 *
 * @throws DiscordTokenError if the HTTP request fails, or if the response
 *   is missing/malformed fields. A malformed 200 response is treated as a
 *   failure too, since silently returning a partial result would produce a
 *   broken session. Check `error === "invalid_grant"` to distinguish a dead
 *   refresh token from a transient failure.
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: requireEnv("NEXT_PUBLIC_DISCORD_CLIENT_ID"),
      client_secret: requireEnv("DISCORD_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res
      .json()
      .catch(() => null)) as DiscordTokenErrorBody | null;
    throw new DiscordTokenError(res.status, body?.error, body?.error_description);
  }

  const data = (await res
    .json()
    .catch(() => null)) as DiscordRefreshTokenResponse | null;

  if (
    !data ||
    typeof data.access_token !== "string" ||
    typeof data.refresh_token !== "string" ||
    typeof data.expires_in !== "number"
  ) {
    // Mirrors the "invalid_token_response" code used for the same situation
    // in the authorization_code exchange (lib/auth/oauth-callback.ts).
    throw new DiscordTokenError(
      res.status,
      "invalid_token_response",
      "Unexpected token response shape from Discord",
    );
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Revoke a Discord OAuth token.
 *
 * Pass the refresh token: revoking any token (access or refresh) revokes
 * ALL access and refresh tokens issued to this user for this app, so
 * starting from the refresh token means we don't need to know or care
 * whether the stored access token is already expired.
 *
 * @throws DiscordTokenError if Discord returns a non-OK response.
 */
export async function revokeToken(token: string): Promise<void> {
  const res = await fetch("https://discord.com/api/oauth2/token/revoke", {
    method: "POST",
    body: new URLSearchParams({
      client_id: requireEnv("NEXT_PUBLIC_DISCORD_CLIENT_ID"),
      client_secret: requireEnv("DISCORD_CLIENT_SECRET"),
      token,
      token_type_hint: "refresh_token",
    }),
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  });

  if (!res.ok) {
    // No response body on success, but a failure may still carry an RFC
    // 6749 error body -- parse defensively, same as refreshAccessToken.
    const body = (await res
      .json()
      .catch(() => null)) as DiscordTokenErrorBody | null;
    throw new DiscordTokenError(res.status, body?.error, body?.error_description);
  }
}
