import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import "server-only";

import { SessionPayload } from "@/types";
import { Session } from "@prisma/client";
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    }) as unknown as { payload: SessionPayload };

    return payload;
  } catch {
    return null;
  }
}

export async function createSession(dbSession: Session) {
  const session = await encrypt({ id: dbSession.id, expiresAt: dbSession.expiresAt });
  ((await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: dbSession.expiresAt,
    sameSite: "lax",
    path: "/",
  }));
  return session;

}

export async function updateSession() {
  const session = await getSession();
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }
  // refresh the user session with refresh token
  // TODO: implement refresh token logic

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  return (await cookies()).get("session")?.value;
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
