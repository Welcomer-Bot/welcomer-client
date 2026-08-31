import "server-only";

import { cache } from "react";

import prisma from "@/lib/prisma";
import { decrypt, getSession } from "@/lib/session";
import { isAdminUserId } from "@/lib/admin/guards";
import { AppError, ErrorCode } from "@/lib/error";
import { canManageGuild } from "@/lib/discord/permissions";
import { decryptToken, encryptToken } from "@/lib/token-crypto";
import { DiscordTokenError, refreshAccessToken } from "@/lib/discord/oauth-token";
import { logDalError } from "./logging";
import { getBotGuildIds, getGuild, getUserByAccessToken, getUserGuildsByAccessToken, } from "./discord";
import { getGuildsFlags } from "./sources";
import { SessionPayload } from "@/types";

/**
 * Verify and parse JWT session from cookies
 *
 * @returns Decrypted session payload or null if invalid/missing
 */
export const verifySession = cache(async(): Promise<SessionPayload | null> => {
  const session = await getSession();
  const clientSession = await decrypt(session);

  if (!clientSession?.sessionId) {
    return null;
  }

  return clientSession;
});

/**
 * Fetch session record from database
 *
 * @returns DB session object or null
 */
export const getSessionData = cache(async() => {
  const session = await verifySession();
  if (!session) return null;
  return await prisma.session.findUnique({
    where: {id: session.sessionId},
  });
});

/**
 * Skew applied when deciding whether a stored access token is still usable.
 * Refreshing 60s ahead of the real Discord expiry absorbs request latency —
 * without it, a token could expire mid-flight between this check and the
 * downstream Discord API call it's used for.
 */
const REFRESH_SKEW_MS = 60_000;

/**
 * Get a usable plaintext Discord access token for a session, transparently
 * refreshing it against Discord when it is at or near expiry.
 *
 * Any code that needs a usable token must come through here rather than
 * reading `.accessToken` off a `Session` row. The one other place that
 * touches these columns is `signOut()` in `lib/actions.ts`, which decrypts
 * `.refreshToken` solely to revoke it. If that rule is broken and a caller
 * reads the column directly, the failure mode is silent, not a crash: it holds
 * `encryptToken()` ciphertext (`"v1:…"`), not a usable OAuth token, so
 * passing it straight to Discord as a Bearer token gets a 401, and
 * `getUserByAccessToken` swallows that into a plain `null` return. The page
 * just renders as "logged out" with nothing in the logs to explain why.
 *
 * Keyed on the primitive `sessionId` rather than accepting the session row
 * object, even though some callers already have the row in hand. `react`'s
 * `cache()` dedupes calls by argument identity, so two lookups for the "same"
 * session would return two distinct object references and defeat dedup if
 * this took the row. Keying on the id instead guarantees every call path
 * collapses onto one in-flight refresh per render, regardless of which lookup
 * produced the id. That collapsing is what stops two branches of the same
 * render from racing each other into a double refresh.
 *
 * It must be the session's own id, not the user's: a user can hold several
 * sessions at once (one per device), each with its own independently-rotating
 * refresh token. Keying on `userId` would collapse two different devices'
 * tokens onto one cache entry and hand a device the other's token.
 *
 * Cross-request races are accepted, not prevented: two separate HTTP
 * requests landing on the exact same expiry instant can both attempt a
 * refresh. If Discord rotates the refresh token on use, the losing request
 * gets back `invalid_grant`, its session row is deleted, and that request's
 * user resolves to a logged-out state. For an already-authorized Discord
 * app, re-running the OAuth flow is a sub-second, silent round trip through
 * `/auth/callback` — self-healing, so no DB-level lock is taken here to
 * prevent it.
 *
 * This function must never touch cookies: Next.js 16 forbids
 * `cookies().delete()` during a Server Component render, and this runs deep
 * inside the DAL, far from any response object. Callers that resolve to a
 * null user already handle this — the existing dashboard layouts
 * `redirect("/api/auth/login")` when the session doesn't produce a user.
 *
 * @param sessionId - The `Session.id` (its primary key) whose access token is needed.
 * @returns Plaintext access token, or null if the session doesn't exist, a
 *   stored token fails to decrypt, or the refresh attempt fails.
 */
export const getAccessToken = cache(
  async(sessionId: string): Promise<string | null> => {
    const row = await prisma.session.findUnique({where: {id: sessionId}});
    if (!row) return null;

    if (row.accessTokenExpiresAt.getTime() - REFRESH_SKEW_MS > Date.now()) {
      try {
        return decryptToken(row.accessToken);
      } catch (error) {
        // A decrypt failure here means a key rotation or data corruption,
        // not a session problem — don't let it blow up a page render.
        logDalError("getAccessToken", ErrorCode.INTERNAL_SERVER_ERROR, error, {
          sessionId,
        });
        return null;
      }
    }

    let refreshToken: string;
    try {
      refreshToken = decryptToken(row.refreshToken);
    } catch (error) {
      logDalError("getAccessToken", ErrorCode.INTERNAL_SERVER_ERROR, error, {
        sessionId,
      });
      return null;
    }

    try {
      const refreshed = await refreshAccessToken(refreshToken);
      await prisma.session.update({
        where: {id: sessionId},
        data: {
          accessToken: encryptToken(refreshed.accessToken),
          refreshToken: encryptToken(refreshed.refreshToken),
          accessTokenExpiresAt: new Date(
            Date.now() + refreshed.expiresIn * 1000,
          ),
        },
      });
      // Return the plaintext we already have — re-decrypting what we just
      // encrypted would be redundant work for the same value.
      return refreshed.accessToken;
    } catch (error) {
      if (error instanceof DiscordTokenError && error.error === "invalid_grant") {
        // The refresh token is permanently dead; the session can never be
        // revived. Delete it so a future request re-authenticates instead
        // of retrying a refresh that will fail forever.
        await prisma.session
          .delete({where: {id: sessionId}})
          .catch((deleteError) => {
            logDalError("getAccessToken", ErrorCode.DATABASE_ERROR, deleteError, {
              sessionId,
            });
          });
        logDalError("getAccessToken", ErrorCode.SESSION_EXPIRED, error, {
          sessionId,
        });
        return null;
      }
      // Any other failure (network error, Discord 5xx, malformed response)
      // is treated as transient — leave the row alone so a later request
      // can retry the refresh.
      logDalError("getAccessToken", ErrorCode.EXTERNAL_API_ERROR, error, {
        sessionId,
      });
      return null;
    }
  },
);

/**
 * Resolve an access token from a bare `userId`, for the admin paths that read
 * another user's account and therefore have no session cookie to key off.
 */
const getAccessTokenForUser = cache(async(userId: string) => {
  const row = await prisma.session.findFirst({
    where: {userId, expiresAt: {gt: new Date()}},
    orderBy: {createdAt: "desc"},
    select: {id: true},
  });
  if (!row) return null;
  return getAccessToken(row.id);
});

/**
 * Get current user from Discord (via OAuth token in session)
 *
 * @returns User instance or null
 */
export const getUser = cache(async() => {
  const sessionData = await getSessionData();
  if (!sessionData) return null;
  const accessToken = await getAccessToken(sessionData.id);
  if (!accessToken) return null;
  return getUserByAccessToken(accessToken);
});

/**
 * Safely fetch user with error handling
 *
 * @returns User object or null
 */
export const fetchUserFromSession = cache(async() => {
  const session = await verifySession();
  if (!session) return null;
  try {
    return await getUser();
  } catch (error) {
    logDalError("fetchUserFromSession", ErrorCode.INTERNAL_SERVER_ERROR, error);
    return null;
  }
});

/**
 * Get user's Discord guilds from OAuth token
 *
 * @returns Array of Guild instances or null
 */
export const getUserGuilds = cache(async() => {
  const sessionData = await getSessionData();
  if (!sessionData) return null;
  const accessToken = await getAccessToken(sessionData.id);
  if (!accessToken) return null;
  return getUserGuildsByAccessToken(accessToken);
});

/**
 * Get user's guilds with mutual status (bot membership check)
 *
 * @returns Array of Guild instances or null
 */
export const getGuilds = cache(async() => {
  const guilds = await getUserGuilds();
  if (!guilds) return null;
  const [botGuilds, flags] = await Promise.all([
    getBotGuildIds(),
    getGuildsFlags(guilds.map((guild) => guild.id)),
  ]);
  const botGuildIds = new Set(botGuilds ?? []);
  await Promise.all(
    guilds.map((guild) => guild.setMutual(botGuildIds.has(guild.id))),
  );
  guilds.forEach((guild) => {
    guild.beta = flags.get(guild.id)?.beta ?? false;
  });
  return guilds;
});

/**
 * Get a specific guild the user has access to
 *
 * @param guildId - Discord guild ID
 * @returns Guild instance or null if no permission
 */
export const getUserGuild = cache(async(guildId: string) => {
  const user = await getUser();
  if (!user) return null;
  if (isAdminUserId(user.id)) return await getGuild(guildId);

  const userGuilds = await getUserGuilds();
  if (!userGuilds) return null;

  return userGuilds.find((guild) => guild.id === guildId) || null;
});

/**
 * Assert the current user has access to the guild, otherwise throw
 * a PERMISSION_DENIED AppError. Returns the guild on success.
 */
export async function requireGuild(guildId: string) {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new AppError(
      "You do not have access to this guild",
      ErrorCode.PERMISSION_DENIED,
      403,
      {guildId},
    );
  }
  return guild;
}

/**
 * Fetch all users from database
 *
 * @returns Array of user records
 */
export async function getUsers() {
  return await prisma.user.findMany();
}

/**
 * Get full user data by user ID
 *
 * @param id - User ID
 * @returns Serialized user object or null
 */
export async function getUserDataById(id: string) {
  const accessToken = await getAccessTokenForUser(id);
  if (!accessToken) return null;
  const user = await getUserByAccessToken(accessToken);
  if (!user) return null;
  return user.toObject();
}

/**
 * Get current user's full data
 *
 * @returns Serialized user object or null
 */
export async function getUserData() {
  const data = await getSessionData();
  if (!data) return null;
  const accessToken = await getAccessToken(data.id);
  if (!accessToken) return null;
  const user = await getUserByAccessToken(accessToken);
  if (!user) return null;
  return user.toObject();
}

/**
 * Get guild data by ID
 *
 * @param guildId - Discord guild ID
 * @returns Serialized guild object or null
 */
export async function getGuildData(guildId: string) {
  const data = await getGuild(guildId);
  if (!data) return null;
  const guild = await getGuild(data.id);
  if (!guild) return null;
  return guild.toObject();
}

/**
 * Get all guilds accessible by user (filtered by permissions)
 *
 * @param userId - User ID
 * @returns Array of serialized guild objects or null
 */
export async function getGuildsByUserId(userId: string) {
  try {
    const accessToken = await getAccessTokenForUser(userId);
    if (!accessToken) return null;
    let guilds = await getUserGuildsByAccessToken(accessToken);
    if (!guilds) return null;

    guilds = guilds.filter(canManageGuild);

    const [botGuilds, flags] = await Promise.all([
      getBotGuildIds(),
      getGuildsFlags(guilds.map((guild) => guild.id)),
    ]);
    const botGuildIds = new Set(botGuilds ?? []);
    await Promise.all(
      guilds.map((guild) => guild.setMutual(botGuildIds.has(guild.id))),
    );
    guilds.forEach((guild) => {
      guild.beta = flags.get(guild.id)?.beta ?? false;
    });
    return guilds.map((guild) => guild.toObject());
  } catch (error) {
    logDalError("getGuildsByUserId", ErrorCode.EXTERNAL_API_ERROR, error, {
      userId,
    });
    return null;
  }
}

/**
 * App session lifetime, in milliseconds
 */
const APP_SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Create DB session from OAuth token
 *
 * Looks up the Discord user with the plaintext access token first (before
 * any encryption happens), then purges expired sessions and upserts this
 * user's row with both tokens encrypted at rest via {@link encryptToken}.
 *
 * @param tokenData.accessToken - OAuth2 access token (plaintext)
 * @param tokenData.refreshToken - OAuth2 refresh token (plaintext)
 * @param tokenData.expiresIn - Discord access token expiry, in seconds
 * @returns Created or refreshed session record or null
 */
export async function createDBSession(tokenData: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}) {
  const user = await getUserByAccessToken(tokenData.accessToken);
  if (!user) {
    return null;
  }

  await prisma.session.deleteMany({where: {expiresAt: {lt: new Date()}}});

  return await prisma.session.create({
    data: {
      accessToken: encryptToken(tokenData.accessToken),
      refreshToken: encryptToken(tokenData.refreshToken),
      accessTokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
      expiresAt: new Date(Date.now() + APP_SESSION_LIFETIME_MS),
      user: {
        connectOrCreate: {
          where: {id: user.id},
          create: {id: user.id, username: user.username},
        },
      },
    },
  });
}

/**
 * Delete a session row.
 *
 * Named `deleteDBSession` to mirror {@link createDBSession} and to stay
 * distinct from `deleteSession` in `lib/session.ts`, which clears the
 * cookie -- signing out needs both, and the two must not be confused.
 *
 * @param sessionId - `Session.id` of the row to delete
 */
export async function deleteDBSession(sessionId: string) {
  await prisma.session.delete({where: {id: sessionId}});
}

/**
 * Add guild to premium program
 *
 * @param guildId - Discord guild ID
 * @returns Created premium record
 */
export const setPremiumGuild = cache(async(guildId: string) => {
  return await prisma.premiumGuild.create({
    data: {
      guild: {
        connectOrCreate: {
          where: {id: guildId},
          create: {id: guildId},
        },
      },
    },
  });
});

/**
 * Get the beta tester user for a guild
 *
 * @param guildId - Discord guild ID
 * @returns Serialized user object or null
 */
export const getBetaTester = cache(async(guildId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      betaGuilds: {
        some: {
          id: guildId,
        },
      },
    },
  });
  if (!user?.id) {
    return null;
  }
  return getUserDataById(user.id);
});

