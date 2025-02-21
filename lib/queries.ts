import { ModuleName } from "@/types";
import { betaGuild, GuildStats, Period, User, UserGuild } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { GuildBasedChannel } from "discord.js";
import { Embed } from "./discord/schema";


export function useGuildChannelsQuery(guildId: string | null) {
  return useQuery({
    queryKey: ["guild", guildId],
    queryFn: async () => {
      if (!guildId) return null;
      const response = await fetch(`/api/guild/${guildId}/channels`);
      return response.json() as Promise<GuildBasedChannel[]>;
    },
  });
}

export function useWelcomerEmbedsQuery(guildId: string | null) {
  return useQuery({
    queryKey: ["guilId", guildId],
    queryFn: async () => {
      if (!guildId) return null;
      const embeds = await fetch(`/api/welcomer/${guildId}/embeds`);
      return await embeds.json() as Embed[];
    },
  });
}

export function usePeriodStatsQuery(guildId: string, period: Period = "DAILY", moduleName: ModuleName) {
  return useQuery({
    queryKey: ["stats", guildId, period, moduleName],
    queryFn: async () => {
      const res = await fetch(`/api/guild/${guildId}/stats?period=${period}&moduleName=${moduleName}`)
      if (!res.ok) {
        throw res;
      }
      return res.json() as Promise<GuildStats>;
    }
  })
}

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: ["admin_user"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/user/${userId}`);
      if (!res.ok) {
        throw res;
      }
      return res.json() as Promise<User & { guilds: (UserGuild & { betaGuild: betaGuild, mutual: boolean })[] }>;
    },
  });
}
