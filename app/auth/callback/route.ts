/**
 * OAuth Callback Handler
 *
 * Discord redirect target. Forwards query params to handleOAuthCallback
 * which validates state, exchanges the token, creates the session, and
 * redirects via next/navigation. Implemented as a Route Handler so cookie
 * mutations are permitted.
 */

import { handleOAuthCallback } from "@/lib/auth/oauth-callback";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pick = (key: string) => url.searchParams.get(key) ?? undefined;

  await handleOAuthCallback({
    code: pick("code"),
    state: pick("state"),
    error: pick("error"),
    errorDescription: pick("error_description"),
  });

  return new Response(null, { status: 204 });
}
