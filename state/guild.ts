import { GuildObject } from "@/lib/discord/guild";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";


export interface GuildParams extends GuildObject {
  setGuild: (guild: GuildObject) => void;
}

export const useGuildStore = create<GuildParams>()(
  immer(
    persist(
      (set) => ({
        id: "",
        name: "",
        icon: null,
        iconUrl: null,
        owner: false,
        permissions: "",
        features: [],
        memberCount: 0,
        banner: null,
        mutual: false,
        bannerUrl: "",
        channels: [],
        setGuild: (guild) => set(() => ({ ...guild })),
      }),
      {
        name: "guild",
      }
    )
  )
);
