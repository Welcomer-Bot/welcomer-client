"use server";

import { getFonts } from "font-list";
import { getGuildDailyStatsSince } from "@/lib/dal/sources";
import { requireGuild } from "@/lib/dal/session";

export type StatsRange = "7d" | "30d" | "all";

export type GuildStatsSummary = {
  joins: number;
  leaves: number;
  messages: number;
  embeds: number;
  images: number;
};

const RANGE_DAYS: Record<StatsRange, number | null> = {
  "7d": 7,
  "30d": 30,
  all: null,
};

/**
 * Aggregate a guild's daily stat rollups over a time range.
 *
 * Permissions:
 * - Verifies user access to guild via requireGuild()
 *
 * @param guildId - Discord guild ID
 * @param range - Time window (7d, 30d, or all-time)
 * @returns Summed counts across the range (zeroes when no data)
 * @throws AppError if guild access is denied
 */
export async function fetchGuildStats(
  guildId: string,
  range: StatsRange
): Promise<GuildStatsSummary> {
  await requireGuild(guildId);

  const days = RANGE_DAYS[range];
  let since: Date | undefined;
  if (days !== null) {
    since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
  }

  const rows = await getGuildDailyStatsSince(guildId, since);

  return rows.reduce<GuildStatsSummary>(
    (acc, r) => ({
      joins: acc.joins + r.joinsCount,
      leaves: acc.leaves + r.leavesCount,
      messages: acc.messages + r.messageCount,
      embeds: acc.embeds + r.embedCount,
      images: acc.images + r.imageCount,
    }),
    { joins: 0, leaves: 0, messages: 0, embeds: 0, images: 0 }
  );
}

/**
 * Fetch all available fonts for server
 *
 * @returns Array of font names
 */
export async function fetchFontList() {
  return await getFonts({ disableQuoting: true });
}

