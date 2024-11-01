import { MessageEmbed } from "@/lib/discord/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface Welcomer {
    id: number | null;
    guildId: string;
    channelId: string | null;
    content: string | null;
    setGuildId: (guildId: string) => void;
    setChannelId: (channelId: string) => void;
    setContent: (content: string) => void;
}

export const useWelcomerStore = create<Welcomer>()(
    persist(
        (set) => ({
            id: null,
            guildId: "",
            channelId: "",
            content: "",
            embeds: [],
            setGuildId: (guildId) => set({ guildId }),
            setChannelId: (channelId) => set({ channelId }),
            setContent: (content) => set({ content }),
        }),
        {
            name: "welcomer",
        },
    ),
);