import { Embed, FullEmbed, Welcomer } from "@/lib/discord/schema";
import { CompleteEmbed } from "@/prisma/zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface WelcomerStore extends Welcomer {
  setGuildId: (guildId: string) => void;
  setChannelId: (channelId: string) => void;
  setContent: (content: string) => void;
  clear(): void;
  addEmbed(embed: CompleteEmbed): void;
  addDefaultEmbed(): void;
  removeEmbed(index: number): void;
  clearEmbeds(): void;
  setEmbedTitle(index: number, title: string): void;
  setEmbedDescription(index: number, description: string): void;
  setEmbedColor(index: number, color: string): void;
  setEmbedTimestamp(index: number, timestamp: Date | null): void;
  setEmbedTimestampNow(index: number, timestampNow: boolean): void;
  setEmbedAuthorName(index: number, author: string): void;
  setEmbedAuthorIcon(index: number, icon: string): void;
  setEmbedAuthorUrl(index: number, url: string): void;
}

const defaultMessage: Welcomer = {
  guildId: "",
  channelId: "",
  content: "Welcome {user} to {guild}",
  embeds: [],
};

const defaultEmbed: CompleteEmbed = {
  title: "Welcome to the server!",
  description: "Welcome {user} to {guild}",
  color: "0x00ff00",
  fields: [],
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
        addEmbed: (embed: CompleteEmbed) =>
          set((state) => {
            if (!state.embeds) {
              state.embeds = [embed];
            } else {
              state.embeds.push(embed);
            }
          }),
        addDefaultEmbed: () =>
          set((state) => {
            if (!state.embeds) {
              state.embeds = [defaultEmbed];
            } else {
              state.embeds.push(defaultEmbed);
            }
          }),
        removeEmbed: (index) =>
          set((state) => {
            state.embeds.splice(index, 1);
          }),
        clearEmbeds: () => set({ embeds: [] }),
        setEmbedTitle: (index, title) =>
          set((state) => {
            state.embeds[index].title = title;
          }),
        setEmbedDescription: (index, description) =>
          set((state) => {
            state.embeds[index].description = description;
          }),
        setEmbedColor: (index, color) =>
          set((state) => {
            state.embeds[index].color = color;
          }),
        setEmbedTimestamp: (index, timestamp) =>
          set((state) => {
            state.embeds[index].timestamp = timestamp;
          }),
        setEmbedAuthorName: (index, author) => set((state) => {
          if (state.embeds[index].author) {
            state.embeds[index].author.name = author
          }
        }),
        setEmbedAuthorIcon: (index, icon) => set((state) => {
          if (state.embeds[index].author) {
            state.embeds[index].author.iconUrl = icon;
          }
        }),
        setEmbedAuthorUrl: (index, url) => set((state) => {
          if (state.embeds[index].author) {
            state.embeds[index].author.url = url;
          }
        }),
        setEmbedTimestampNow: (index, timestampNow) =>
          set((state) => {
            state.embeds[index].timestampNow = timestampNow;
          }),
      }),
      {
        name: "welcomer",
      }
    )
  )
);
