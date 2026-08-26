"use server";

import { redirect } from "next/navigation";

import { revokeToken } from "@/lib/discord/oauth-token";
import { deleteDBSession, getSessionData } from "@/lib/dal/session";
import { logDalError } from "@/lib/dal/logging";
import { ErrorCode } from "@/lib/error";
import { decryptToken } from "@/lib/token-crypto";

import { deleteSession } from "./session";

/**
 * Sign out the user and clear session
 *
 * @throws Redirect to home page
 */
export async function signOut() {
  // Declared outside the try block so the catch below can still report
  // which session failed, even if the failure happened after the row was
  // read (e.g. during decrypt, revoke, or delete).
  let userId: string | undefined;
  let sessionId: string | undefined;

  try {
    const session = await getSessionData();
    if (session) {
      userId = session.userId;
      sessionId = session.id;

      try {
        await revokeToken(decryptToken(session.refreshToken));
      } catch (error) {
        logDalError("signOut.revoke", ErrorCode.EXTERNAL_API_ERROR, error, {
          userId,
          sessionId,
        });
      }
      await deleteDBSession(session.id);
    }
  } catch (error) {
    logDalError("signOut", ErrorCode.INTERNAL_SERVER_ERROR, error, {
      userId,
      sessionId,
    });
  }

  await deleteSession();
  redirect("/");
}
