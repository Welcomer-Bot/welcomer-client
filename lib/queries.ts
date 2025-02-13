import { useQuery } from "@tanstack/react-query";
import { Embed } from "./discord/schema";
import { APIChannel } from "discord-api-types/v10";
import { GuildStats, Period } from "@prisma/client";
import { ModuleName } from "@/types";

export function useGuildChannelsQuery(guildId: string | null) {
  return useQuery({
    queryKey: ["guild", guildId],
    queryFn: async () => {
      if (!guildId) return null;
      const response = await fetch(`/api/guild/${guildId}/channels`);
      return response.json() as Promise<APIChannel[]>;
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
