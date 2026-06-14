import "server-only";

import { defaultLeaverEmbed, defaultWelcomeEmbed } from "@/types/embed";
import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";

import prisma from "@/lib/prisma";
import { ErrorCode } from "@/lib/error";
import { logDalError } from "./logging";
import { ImageCard, Period, Prisma, Source, SourceType, } from "@/generated/prisma/client";

/**
 * Fetch all sources of a specific type for a guild
 *
 * @param guildId - Discord guild ID
 * @param source - Source type (e.g., "Welcomer", "Leaver")
 * @returns Array of sources with relationships or null on error
 */
export async function getSources(
  guildId: string,
  source: SourceType,
): Promise<Source[] | null> {
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
}

/**
 * Fetch a single source by ID with relationships
 *
 * @param guildId - Discord guild ID
 * @param sourceId - Source record ID
 * @returns Source with activeCard and images or null
 */
export async function getSource(
  guildId: string,
  sourceId: number,
): Promise<Source | null> {
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
}

/**
 * Get the latest stats record for a guild/source/period
 *
 * @param guildId - Discord guild ID
 * @param period - Stat period (e.g., "DAILY", "WEEKLY")
 * @param source - Source type
 * @returns Latest stats record or null
 */
export async function getLatestGuildStats(
  guildId: string,
  period: Period,
  source: SourceType,
) {
  return await prisma.guildStats.findFirst({
    where: {
      Guild: {
        id: guildId,
      },
      period,
      source,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Create a new stats record (if not already existing)
 *
 * @param guildId - Discord guild ID
 * @param period - Stat period
 * @param source - Source type
 * @returns Created or existing stats record
 */
export async function createGuildStats(
  guildId: string,
  period: Period,
  source: SourceType,
) {
  const latestStats = await getLatestGuildStats(guildId, period, source);

  if (!latestStats) {
    return await prisma.guildStats.create({
      data: {
        Guild: {
          connectOrCreate: {
            where: {id: guildId},
            create: {id: guildId},
          },
        },
        period,
        source,
        createdAt: new Date(),
      },
    });
  }
}

/**
 * Create stats records for all periods of a module
 *
 * @param guildId - Discord guild ID
 * @param source - Source type
 */
export async function createModuleStats(guildId: string, source: SourceType) {
  await Promise.all(
    Object.values(Period).map((period) =>
      createGuildStats(guildId, period, source),
    ),
  );
}

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
  const message: object =
    type === "Welcomer" ? defaultWelcomerMessage : defaultLeaverMessage;

  const source = await prisma.source.create({
    data: {
      Guild: {
        connectOrCreate: {
          where: {id: guildId},
          create: {id: guildId},
        },
      },
      type,
      message,
    },
  });

  const updatedSource = await prisma.source.update({
    where: {id: source.id},
    data: {
      activeCard: {
        create: {
          data: {},
          Source: {
            connect: {id: source.id},
          },
        },
      },
    },
  });

  await createModuleStats(guildId, type);
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
        Source: {
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
 * Check if a guild is in beta program
 *
 * @param guildId - Discord guild ID
 * @returns Beta record or null
 */
export async function getGuildBeta(guildId: string) {
  return prisma.betaGuild.findFirst({
    where: {id: guildId},
  });
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
            where: {id: guildId},
            create: {id: guildId},
          },
        },
        user: {
          connect: {id: userId || ""},
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
 * Fetch all guild stats since a given time
 *
 * @param guildId - Discord guild ID
 * @param period - Stat period
 * @param source - Source type
 * @param since - Start date
 * @returns Array of stats records
 */
export async function getAllGuildStatsSinceTime(
  guildId: string,
  period: Period,
  source: SourceType,
  since: Date,
) {
  return await prisma.guildStats.findMany({
    where: {
      guildId,
      period,
      source,
      createdAt: {
        gte: since,
      },
    },
  });
}

