"use server";

import { GuildStats, Period, SourceType } from "../generated/prisma/client";
import { getFonts } from "font-list";
import { getAllGuildStatsSinceTime, getLatestGuildStats } from "./dal";

type StatsDictionary = {
  [key in Period]: GuildStats | null;
};

export async function fetchGuildStats(
  guildId: string,
  type: SourceType
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
  type: SourceType
) {
  return await getLatestGuildStats(guildId, period, type);
}

export async function fetchAllGuildStatsSinceTime(
  guildId: string,
  period: Period,
  type: SourceType,
  since: Date
) {
  // const guild = await getGuild(guildId)
  // if (!guild?.premium) {
  //   return null;
  // }
  return await getAllGuildStatsSinceTime(guildId, period, type, since);
}

export async function fetchFontList() {
  return await getFonts({ disableQuoting: true });
}

// export async function fetchUserDataAdmin(userId: string) {
//   const user = await fetchUserFromSession()
//   if (user?.id !== "479216487173980160") throw new Error("Unauthorized");
//   const userGuilds = await getGuildsByUserId(userId);
//   const targetUser = await getUserById(userId)
//   if (!targetUser) throw new Error("User not found");
//   return { ...targetUser, guilds: userGuilds };
// }
