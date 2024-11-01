import { useQuery } from "@tanstack/react-query";


export function useGuildChannelsQuery(guildId: string | null) {
    return useQuery({
        queryKey: ["guild", guildId],
        queryFn: async () => {
        console.log("guildID",guildId);
        if (!guildId) return null;
        const response = await fetch(`/api/guild/${guildId}/channels`);
        return response.json();
    }});
}