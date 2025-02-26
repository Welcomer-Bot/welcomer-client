"use server";
import { ModuleName } from "@/types";
import { GuildStats, Period } from "@prisma/client";
import { getFonts } from "font-list";
import { canUserManageGuild, getAllGuildStatsSinceTime, getGuild, getGuildChannels, getGuildsByUserId, getLatestGuildStats, getUser, getUserById } from "./dal";

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

export async function fetchAllGuildStatsSinceTime(guildId: string,
  period: Period,
  type: ModuleName,
  since: Date
) {
  const guild = await getGuild(guildId)
  if (!guild?.premium) {
    throw new Error("This feature requires premium subscription");
  }
  return await getAllGuildStatsSinceTime(guildId, period, type, since)
}

export async function fetchGuildChannels(guildId: string) {
  if (!canUserManageGuild(guildId)) throw new Error("You can't acces to this resource !");
  return await getGuildChannels(guildId)
}

export async function fetchFontList() {
  return await getFonts({ disableQuoting: true });
}

export async function fetchUserDataAdmin(userId: string) {
  const user = await getUser()
  if (user?.id !== "479216487173980160") throw new Error("Unauthorized");
  const userGuilds = await getGuildsByUserId(userId);
  const targetUser = await getUserById(userId)
  if (!targetUser) throw new Error("User not found");
  return { ...targetUser, guilds: userGuilds };
}