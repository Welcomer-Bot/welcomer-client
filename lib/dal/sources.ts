import "server-only";

import { cache } from "react";

import { ImageCard, Prisma, Source, SourceType, } from "@/generated/prisma/client";
import { ErrorCode } from "@/lib/error";
import prisma from "@/lib/prisma";
import { defaultLeaverEmbed, defaultWelcomeEmbed } from "@/types/embed";
import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { logDalError } from "./logging";

/**
 * Fetch all sources of a specific type for a guild
 *
 * @param guildId - Discord guild ID
 * @param source - Source type (e.g., "WELCOMER", "LEAVER")
 * @returns Array of sources with relationships or null on error
 */
export const getSources = cache(async (
  guildId: string,
  source: SourceType,
): Promise<Source[] | null> => {
  try {
    return await prisma.source.findMany({
      where: {
        guildId,
        type: source,
      },
      include: {
        activeCard: true,
        images: true,
      },
    });
  } catch (error) {
    logDalError("getSources", ErrorCode.DATABASE_ERROR, error, {
      guildId,
      source,
    });
    return null;
  }
});

/**
 * Fetch a single source by ID with relationships
 *
 * @param guildId - Discord guild ID
 * @param sourceId - Source record ID
 * @returns Source with activeCard and images or null
 */
export const getSource = cache(async (
  guildId: string,
  sourceId: number,
): Promise<Source | null> => {
  try {
    return await prisma.source.findFirst({
      where: {
        guildId,
        id: sourceId,
      },
      include: {
        activeCard: true,
        images: true,
      },
    });
  } catch (error) {
    logDalError("getSource", ErrorCode.DATABASE_ERROR, error, {
      guildId,
      sourceId,
    });
    return null;
  }
});

const defaultWelcomerMessage: RESTPostAPIChannelMessageJSONBody = {
  content: "Welcome {user} to {guild}",
  embeds: [defaultWelcomeEmbed],
};

const defaultLeaverMessage: RESTPostAPIChannelMessageJSONBody = {
  content: "Goodbye {user} from {guild}",
  embeds: [defaultLeaverEmbed],
};

/**
 * Create a new source with default message and active card
 *
 * @param guildId - Discord guild ID
 * @param type - Source type
 * @returns Created source with activeCard
 */
export async function createSource(guildId: string, type: SourceType) {
  const message =
    type === SourceType.WELCOMER ? defaultWelcomerMessage : defaultLeaverMessage;

  const source = await prisma.source.create({
    data: {
      guild: {
        connectOrCreate: {
          where: { id: guildId },
          create: { id: guildId },
        },
      },
      type,
      message,
    },
  });

  const updatedSource = await prisma.source.update({
    where: { id: source.id },
    data: {
      activeCard: {
        create: {
          data: {},
          source: {
            connect: { id: source.id },
          },
        },
      },
    },
  });

  return updatedSource;
}

/**
 * Delete a source and all related data
 *
 * @param guildId - Discord guild ID
 * @param sourceId - Source record ID
 * @returns Deleted source object
 */
export async function deleteSource(guildId: string, sourceId: number) {
  return await prisma.source.delete({
    where: {
      guildId,
      id: sourceId,
    },
  });
}

/**
 * Execute an update mutation on a source
 *
 * Note: Permission checks should be done before calling this
 *
 * @param source - Source record to update
 * @param data - Prisma update data
 * @returns Updated source
 */
export async function updateSourceQuery(
  source: Source,
  data: Prisma.XOR<Prisma.SourceUpdateInput, Prisma.SourceUncheckedUpdateInput>,
) {
  return prisma.source.update({
    where: {
      id: source.id,
    },
    data,
  });
}

/**
 * Execute a delete mutation on a source
 *
 * @param source - Source record to delete
 * @returns Deleted source
 */
export async function deleteSourceQuery(source: Source) {
  return await prisma.source.delete({
    where: {
      id: source.id,
    },
  });
}

/**
 * Delete an image card by ID
 *
 * @param card - ImageCard record
 * @returns Deleted card
 */
export async function deleteCardQuery(card: ImageCard) {
  return prisma.imageCard.delete({
    where: {
      id: card.id,
    },
  });
}

/**
 * Fetch an image card only if it belongs to a source in the given guild.
 *
 * @param guildId - Discord guild ID
 * @param cardId - Image card ID
 * @returns ImageCard or null when not found/out-of-scope
 */
export async function getImageCardForGuild(
  guildId: string,
  cardId: number,
): Promise<ImageCard | null> {
  try {
    return await prisma.imageCard.findFirst({
      where: {
        id: cardId,
        source: {
          guildId,
        },
      },
    });
  } catch (error) {
    logDalError("getImageCardForGuild", ErrorCode.DATABASE_ERROR, error, {
      guildId,
      cardId,
    });
    return null;
  }
}

/**
 * Update an image card's data
 *
 * @param card - ImageCard record
 * @param data - Prisma update data
 * @returns Updated card
 */
export async function updateImageCardQuery(
  card: ImageCard,
  data: Prisma.XOR<
    Prisma.ImageCardUpdateInput,
    Prisma.ImageCardUncheckedUpdateInput
  >,
) {
  return prisma.imageCard.update({
    where: {
      id: card.id,
    },
    data,
  });
}

/**
 * Create a new image card
 *
 * @param data - Prisma create data
 * @returns Created image card
 */
export async function createImageCardQuery(
  data: Prisma.XOR<
    Prisma.ImageCardCreateInput,
    Prisma.ImageCardUncheckedCreateInput
  >,
) {
  return prisma.imageCard.create({
    data,
  });
}

/**
 * Execute multiple queries in a transaction
 *
 * @param queries - Array of Prisma promises
 * @returns Array of results in transaction order
 */
export async function executeQueries(
  queries: Prisma.PrismaPromise<unknown>[],
): Promise<unknown[]> {
  return await prisma.$transaction(queries);
}

/**
 * Add a guild to beta program
 *
 * @param guildId - Discord guild ID
 * @param userId - Optional user ID (beta tester)
 * @returns true if successful, false on error
 */
export async function addGuildToBeta(guildId: string, userId?: string) {
  try {
    return !!(await prisma.betaGuild.create({
      data: {
        guild: {
          connectOrCreate: {
            where: { id: guildId },
            create: { id: guildId },
          },
        },
        user: {
          connect: { id: userId || "" },
        },
      },
    }));
  } catch (error) {
    logDalError("addGuildToBeta", ErrorCode.DATABASE_ERROR, error, {
      guildId,
      hasUserId: Boolean(userId),
    });
    return false;
  }
}

/**
 * Remove a guild from beta program
 *
 * @param guildId - Discord guild ID
 * @returns true if successful, false on error
 */
export async function removeGuildFromBeta(guildId: string) {
  try {
    return !!(await prisma.betaGuild.delete({
      where: {
        id: guildId,
      },
    }));
  } catch (error) {
    logDalError("removeGuildFromBeta", ErrorCode.DATABASE_ERROR, error, {
      guildId,
    });
    return false;
  }
}

/**
 * Fetch daily stat rollups for a guild since a given date.
 *
 * @param guildId - Discord guild ID
 * @param since - Lower bound (inclusive); omit for all-time
 * @returns Array of daily stat rows
 */
export async function getGuildDailyStatsSince(guildId: string, since?: Date) {
  return await prisma.guildDailyStat.findMany({
    where: {
      guildId,
      ...(since && { date: { gte: since } }),
    },
  });
}

/**
 * Fetch the most recent event timestamp for each of a guild's sources.
 *
 * One grouped query for every source rather than one findFirst per module.
 *
 * @param guildId - Discord guild ID
 * @param sourceIds - Sources to look up
 * @returns Map of source ID to its latest event date; absent when never used
 */
export async function getLastEventAtBySource(
  guildId: string,
  sourceIds: number[],
): Promise<Map<number, Date>> {
  if (sourceIds.length === 0) return new Map();

  try {
    const rows = await prisma.guildEvent.groupBy({
      by: ["sourceId"],
      where: { guildId, sourceId: { in: sourceIds } },
      _max: { occurredAt: true },
    });

    return new Map(
      rows.flatMap((row) =>
        row.sourceId !== null && row._max.occurredAt
          ? ([[row.sourceId, row._max.occurredAt]] as [number, Date][])
          : [],
      ),
    );
  } catch (error) {
    logDalError("getLastEventAtBySource", ErrorCode.DATABASE_ERROR, error, {
      guildId,
    });

    return new Map();
  }
}

/**
 * Fetch a guild's beta/premium flags in a single query.
 *
 * @param guildId - Discord guild ID
 * @returns Flags; both false when the guild is unknown or on error
 */
export async function getGuildFlags(
  guildId: string,
): Promise<{ beta: boolean; premium: boolean }> {
  try {
    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
      select: { betaAccess: true, premiumPlan: true },
    });

    return {
      beta: Boolean(guild?.betaAccess),
      premium: Boolean(guild?.premiumPlan),
    };
  } catch (error) {
    logDalError("getGuildFlags", ErrorCode.DATABASE_ERROR, error, { guildId });
    return { beta: false, premium: false };
  }
}

/**
 * Fetch beta/premium flags for multiple guilds in a single query.
 *
 * Batched counterpart to getGuildFlags, for callers rendering a list of
 * guilds (avoids one findUnique per guild).
 * 
 * @param guildIds - Discord guild IDs to look up
 * @returns Map of guild ID to flags; guilds absent from the map (unknown
 *   or not in the DB yet) should be treated as { beta: false, premium: false }
 */
export async function getGuildsFlags(
  guildIds: string[],
): Promise<Map<string, { beta: boolean; premium: boolean }>> {
  if (guildIds.length === 0) return new Map();

  try {
    const guilds = await prisma.guild.findMany({
      where: { id: { in: guildIds } },
      select: { id: true, betaAccess: true, premiumPlan: true },
    });

    return new Map(
      guilds.map((guild) => [
        guild.id,
        { beta: Boolean(guild.betaAccess), premium: Boolean(guild.premiumPlan) },
      ]),
    );
  } catch (error) {
    logDalError("getGuildsFlags", ErrorCode.DATABASE_ERROR, error, {
      guildCount: guildIds.length,
    });
    return new Map();
  }
}

