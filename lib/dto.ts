"use server";

import { requireGuild } from "@/lib/dal/session";
import { getGuildDailyStatsSince } from "@/lib/dal/sources";
import {
  GuildStats,
  GuildStatsSummary,
  MemberPoint,
  RANGE_DAYS,
  StatsRange,
} from "./utils";

/**
 * Aggregate a guild's daily stat rollups over a time range.
 *
 * Permissions:
 * - Verifies user access to guild via requireGuild()
 *
 * @param guildId - Discord guild ID
 * @param range - Time window (7d, 30d, or all-time)
 * @returns Summed counts across the range (zeroes when no data), plus the
 *          member-count series for the same window
 * @throws AppError if guild access is denied
 */
export async function fetchGuildStats(
  guildId: string,
  range: StatsRange
): Promise<GuildStats> {
  await requireGuild(guildId);

  const days = RANGE_DAYS[range];
  let since: Date | undefined;
  if (days !== null) {
    since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
  }

  const rows = await getGuildDailyStatsSince(guildId, since);

  const summary = rows.reduce<GuildStatsSummary>(
    (acc, r) => ({
      joins: acc.joins + r.joinsCount,
      leaves: acc.leaves + r.leavesCount,
      messages: acc.messages + r.messageCount,
      embeds: acc.embeds + r.embedCount,
      images: acc.images + r.imageCount,
    }),
    { joins: 0, leaves: 0, messages: 0, embeds: 0, images: 0 }
  );

  const byDate = new Map(
    rows
      .filter((r) => r.memberCount !== null)
      .map((r) => [r.date.toISOString().slice(0, 10), r.memberCount as number]),
  );

  // Emit one point per day of the window, so the axis shows the whole selected
  // period rather than only the days that happen to have a snapshot. Days
  // without one carry null — a gap, never a zero. Building it here (not in the
  // chart) keeps labels and values aligned by construction: pairing a full list
  // of dates with a shorter list of values would slide each value onto the
  // wrong day.
  const series: MemberPoint[] =
    days !== null
      ? Array.from({ length: days }, (_, i) => {
          const day = new Date();

          day.setUTCHours(0, 0, 0, 0);
          day.setUTCDate(day.getUTCDate() - (days - 1 - i));

          const date = day.toISOString().slice(0, 10);

          return { date, memberCount: byDate.get(date) ?? null };
        })
      : [...byDate.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, memberCount]) => ({ date, memberCount }));

  return { ...summary, series };
}

