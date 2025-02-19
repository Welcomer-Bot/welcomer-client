import { ModuleName } from "@/types";
import { GuildStats, Period } from "@prisma/client";
import "server-only";
import { getLatestGuildStats } from "./dal";

type StatsDictionary = {
  [key in Period]: GuildStats | null;
};

export async function fetchGuildStats(
  guildId: string,
  type: ModuleName
): Promise<StatsDictionary> {
  const res: StatsDictionary = {} as StatsDictionary;

  await Promise.all(
    Object.values(Period).map(async (period) => {
      res[period] = await getLatestGuildStats(guildId, period, type);
    })
  );

  return res;
}

export async function fetchGuildStat(
  guildId: string,
  period: Period,
  type: ModuleName
) {
      return await getLatestGuildStats(guildId, period, type);

}