import { create } from "zustand";
import { persist } from "zustand/middleware";

interface sendSettingsStore {
  mode: "channel",
  channelId: string | null,
  setChannelId: (channelId: string) => void,
}

export const useSendSettingsStore = create<sendSettingsStore>()(
  persist(
    (set) => ({
      mode: "channel",
      channelId: null,
      setChannelId: (channelId) => set({ channelId }),
    }),
    {
      name: "send-settings",
    },
  ),
);
