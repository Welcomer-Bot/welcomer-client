import "server-only";

import { cache } from "react";

import prisma from "@/lib/prisma";
import { decrypt, getSession } from "@/lib/session";
import { isAdminUserId } from "@/lib/admin/guards";
import { ErrorCode } from "@/lib/error";
import { logDalError } from "./logging";
import {
  getGuild,
  getUserByAccessToken,
  getUserGuildsByAccessToken,
} from "./discord";
import { SessionPayload } from "@/types";

/**
 * Verify and parse JWT session from cookies
 *
 * @returns Decrypted session payload or null if invalid/missing
 */
export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  const session = await getSession();
  const clientSession = await decrypt(session);

  if (!clientSession?.id) {
    return null;
  }

  return clientSession;
});

/**
 * Fetch session record from database
 *
 * @returns DB session object or null
 */
export async function getSessionData() {
  const session = await verifySession();
  if (!session) return null;
  return await prisma.session.findFirst({
    where: {
      id: session.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Fetch session by user ID
 *
 * @param id - User ID
 * @returns DB session object or null
 */
export async function getSessionDataById(id: string) {
  return await prisma.session.findFirst({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get current user from Discord (via OAuth token in session)
 *
 * @returns User instance or null
 */
export const getUser = cache(async () => {
  const sessionData = await getSessionData();
  if (!sessionData || !sessionData.accessToken) return null;
  return getUserByAccessToken(sessionData.accessToken);
});

/**
 * Safely fetch user with error handling
 *
 * @returns User object or null
 */
export const fetchUserFromSession = cache(async () => {
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
export const getUserGuilds = cache(async () => {
  const sessionData = await getSessionData();
  if (!sessionData || !sessionData.accessToken) return null;
  return getUserGuildsByAccessToken(sessionData.accessToken);
});

/**
 * Get user's guilds with mutual status (bot membership check)
 *
 * @returns Array of Guild instances or null
 */
export const getGuilds = cache(async () => {
  const guilds = await getUserGuilds();
  if (!guilds) return null;
  await Promise.all(
    guilds.map(async (guild) => {
      const botGuild = await getGuild(guild.id);
      await guild.setMutual(!!botGuild);
    }),
  );
  return guilds;
});

/**
 * Get a specific guild the user has access to
 *
 * @param guildId - Discord guild ID
 * @returns Guild instance or null if no permission
 */
export const getUserGuild = cache(async (guildId: string) => {
  const user = await getUser();
  if (!user) return null;
  if (isAdminUserId(user.id)) return await getGuild(guildId);

  const userGuilds = await getUserGuilds();
  if (!userGuilds) return null;

  return userGuilds.find((guild) => guild.id === guildId) || null;
});

/**
 * Fetch all users from database
 *
 * @returns Array of user records
 */
export async function getUsers() {
  return await prisma.user.findMany();
}

/**
 * Get basic user record by ID
 *
 * @param id - User ID
 * @returns User record or null
 */
export async function getUserBaseData(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Get full user data by user ID
 *
 * @param id - User ID
 * @returns Serialized user object or null
 */
export async function getUserDataById(id: string) {
  const data = await getSessionDataById(id);
  if (!data) return null;
  const user = await getUserByAccessToken(data.accessToken);
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
  const user = await getUserByAccessToken(data.accessToken);
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
    const data = await getSessionDataById(userId);
    if (!data) return null;
    let guilds = await getUserGuildsByAccessToken(data.accessToken);
    if (!guilds) return null;

    guilds = guilds.filter((guild) => {
      return (
        guild.owner ||
        (guild.permissions && (Number(guild.permissions) & 0x20) === 0x20)
      );
    });

    await Promise.all(
      guilds.map(async (guild) => {
        const botGuild = await getGuild(guild.id);
        await guild.setMutual(!!botGuild);
      }),
    );
    return guilds.map((guild) => guild.toObject());
  } catch (error) {
    logDalError("getGuildsByUserId", ErrorCode.EXTERNAL_API_ERROR, error, {
      userId,
    });
    return null;
  }
}

/**
 * Create DB session from OAuth token
 *
 * @param access_token - OAuth2 access token
 * @param expires - Token expiry in seconds
 * @returns Created session record or null
 */
export async function createDBSession(access_token: string, expires: number) {
  const user = await getUserByAccessToken(access_token);
  if (!user) {
    return null;
  }
  return await prisma.session.create({
    data: {
      accessToken: access_token,
      expiresAt: new Date(Date.now() + expires * 1000),
      user: {
        connectOrCreate: {
          where: { id: user.id },
          create: { id: user.id, username: user.username },
        },
      },
    },
  });
}

/**
 * Check if guild is in premium program
 *
 * @param guildId - Discord guild ID
 * @returns true if premium, false otherwise
 */
export const isPremiumGuild = cache(async (guildId: string) => {
  return !!(await prisma.premiumGuild.findUnique({
    where: {
      id: guildId,
    },
  }));
});

/**
 * Add guild to premium program
 *
 * @param guildId - Discord guild ID
 * @returns Created premium record
 */
export const setPremiumGuild = cache(async (guildId: string) => {
  return await prisma.premiumGuild.create({
    data: {
      guild: {
        connectOrCreate: {
          where: { id: guildId },
          create: { id: guildId },
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
export const getBetaTester = cache(async (guildId: string) => {
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

