import { useQuery } from "@tanstack/react-query";
import { Embed } from "./discord/schema";

export function useGuildChannelsQuery(guildId: string | null) {
  return useQuery({
    queryKey: ["guild", guildId],
    queryFn: async () => {
      console.log("guildID", guildId);
      if (!guildId) return null;
      const response = await fetch(`/api/guild/${guildId}/channels`);
      return response.json();
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
