import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Embed } from "@/lib/discord/schema";

export interface EmbedsStore {
  embeds: Embed[];
  setEmbeds: (embeds: Embed[] | null) => void;
  addEmbed: (embed: Embed) => void;
  deleteEmbed: (i: number) => void;
  clearEmbeds: () => void;
}

const defaultEmbeds = {
  embeds: [
    {
      id: -1,
      title: "Welcome to the server!",
      description: "Welcome {user} to {guild}",
      color: 0x00ff00,
    }
  ],
};

const emptyEmbeds = {
  embeds: [],
};

export const useEmbedsStore =
  create<EmbedsStore>()(
    immer(
      persist(
        (set, get) => ({
          ...defaultEmbeds,
          setEmbeds: (embeds: Embed[] | null) => set((state) => { 
            if (embeds) {
              state.embeds = embeds;
            }else {
              state.embeds = [];
            }
          }),
          addEmbed: (embed: Embed) =>
            set((state) => {
              if (!state.embeds) {
                state.embeds = [embed];
              } else {
                state.embeds.push(embed);
              }
            }),
          deleteEmbed: (i: number) =>
            set((state) => {
              state.embeds.splice(i, 1);
            }),
          clearEmbeds: () => set(emptyEmbeds),
        }),
        {
          name: "embeds",
        }
      )
    )
  );