"use server";

import { GuildStats, Period, SourceType } from "../generated/prisma/client";
import { getFonts } from "font-list";
import { getAllGuildStatsSinceTime, getLatestGuildStats } from "@/lib/dal/sources";
import { getUserGuild } from "@/lib/dal/session";
import { AppError, ErrorCode } from "@/lib/error";

type StatsDictionary = {
  [key in Period]: GuildStats | null;
};

/**
 * Fetch all guild statistics for a source type
 *
 * Permissions:
 * - Verifies user access to guild via getUserGuild()
 *
 * @param guildId - Discord guild ID
 * @param type - Source type (e.g., "Welcomer", "Leaver")
 * @returns Dictionary of stats per period or null if error
 * @throws AppError if guild access is denied
 */
export async function fetchGuildStats(
  guildId: string,
  type: SourceType
): Promise<StatsDictionary> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new AppError(
      "You do not have permission to access this guild",
      ErrorCode.PERMISSION_DENIED,
      403,
      { guildId }
    );
  }

  const res: StatsDictionary = {} as StatsDictionary;

  await Promise.all(
    Object.values(Period).map(async (period) => {
      res[period] = await getLatestGuildStats(guildId, period, type);
    })
  );

  return res;
}

/**
 * Fetch a single guild statistic record
 *
 * Permissions:
 * - Verifies user access to guild via getUserGuild()
 *
 * @param guildId - Discord guild ID
 * @param period - Stat period (e.g., "DAILY", "WEEKLY")
 * @param type - Source type
 * @returns Latest stat record for period or null
 * @throws AppError if guild access is denied
 */
export async function fetchGuildStat(
  guildId: string,
  period: Period,
  type: SourceType
) {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new AppError(
      "You do not have permission to access this guild",
      ErrorCode.PERMISSION_DENIED,
      403,
      { guildId }
    );
  }

  return await getLatestGuildStats(guildId, period, type);
}

/**
 * Fetch all guild statistics since a given time
 *
 * Permissions:
 * - Assumes caller has verified guild access
 *
 * @param guildId - Discord guild ID
 * @param period - Stat period
 * @param type - Source type
 * @param since - Fetch stats after this date
 * @returns Array of stat records or null
 */
export async function fetchAllGuildStatsSinceTime(
  guildId: string,
  period: Period,
  type: SourceType,
  since: Date
) {
  return await getAllGuildStatsSinceTime(guildId, period, type, since);
}

/**
 * Fetch all available fonts for server
 *
 * @returns Array of font names
 */
export async function fetchFontList() {
  return await getFonts({ disableQuoting: true });
}

