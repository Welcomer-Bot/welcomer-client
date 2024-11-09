import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Guild {
  id: string;
}

export interface GuildParams extends Guild {
  setGuildId: (guildId: string) => void;
}

export const useGuildStore = create<GuildParams>()(
  immer(
    persist(
      (set, get) => ({
        id: "",
        name: "",
        icon: "",
        setGuildId: (guildId) => set({ id: guildId }),
      }),
      {
        name: "guild",
      }
    )
  )
);
