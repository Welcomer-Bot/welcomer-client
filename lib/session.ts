import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import "server-only";

import { AppError, ErrorCode } from "@/lib/error";
import { SessionPayload } from "@/types";
import { Session } from "../generated/prisma/client";

const SESSION_COOKIE_NAME = "session";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Require SESSION_SECRET environment variable
 *
 * @throws AppError with INTERNAL_SERVER_ERROR if SESSION_SECRET is not set
 * @returns SESSION_SECRET value
 */
function requireSessionSecret() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new AppError(
      "Missing required environment variable: SESSION_SECRET",
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      { env: "SESSION_SECRET" }
    );
  }
  return secretKey;
}

const encodedKey = new TextEncoder().encode(requireSessionSecret());

const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  try {
    const { payload } = (await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })) as unknown as { payload: SessionPayload };

    if (!payload?.id || !payload.expiresAt) {
      return null;
    }

    const expiresAt = new Date(payload.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
      return null;
    }

    return {
      ...payload,
      expiresAt,
    };
  } catch {
    return null;
  }
}

export async function createSession(dbSession: Session) {
  const session = await encrypt({
    id: dbSession.id,
    expiresAt: dbSession.expiresAt,
  });
  (await cookies()).set(SESSION_COOKIE_NAME, session, {
    ...sessionCookieOptions,
    expires: dbSession.expiresAt,
  });
  return session;
}

export async function getSession() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
