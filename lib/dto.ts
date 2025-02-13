import { ModuleName } from "@/types";
import { GuildStats, Period } from "@prisma/client";
import "server-only";
import { getGuildStats } from "./dal";

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
      res[period] = await getGuildStats(guildId, period, type);
    })
  );

  return res;
}

export async function fetchGuildStat(
  guildId: string,
  period: Period,
  type: ModuleName
) {
      return await getGuildStats(guildId, period, type);

}