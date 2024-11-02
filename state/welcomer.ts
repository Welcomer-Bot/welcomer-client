import { Embed, Welcomer } from "@/lib/discord/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface WelcomerStore extends Welcomer {
  setGuildId: (guildId: string) => void;
  setChannelId: (channelId: string) => void;
  setContent: (content: string) => void;
  clear(): void;
}

const defaultMessage: Welcomer = {
  id: 0,
  guildId: "",
  channelId: "",
  content: "Welcome {user} to {guild}",
};

export const useWelcomerStore = create<WelcomerStore>()(
  immer(
    persist(
      (set) => ({
        ...defaultMessage,
        setGuildId: (guildId) => set({ guildId }),
        setChannelId: (channelId) => set({ channelId }),
        setContent: (content) => set({ content }),
        clear: () => set(defaultMessage),
      }),
      {
        name: "welcomer",
      }
    )
  )
);
