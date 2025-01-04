import { Welcomer } from "@/lib/discord/schema";
import { CompleteEmbed, CompleteEmbedField } from "@/prisma/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface WelcomerStore extends Welcomer {
  deletedEmbeds: CompleteEmbed[];
  deletedFields: CompleteEmbedField[];
  setGuildId: (guildId: string) => void;
  setChannelId: (channelId: string) => void;
  setContent: (content: string) => void;

  clear(): void;

  addEmbed(embed: CompleteEmbed): void;

  addDefaultEmbed(): void;

  removeEmbed(index: number): void;
  setToPreviousEmbed(index: number): void;
  setToNextEmbed(index: number): void;

  clearEmbeds(): void;

  setEmbedTitle(index: number, title: string): void;

  setEmbedDescription(index: number, description: string): void;

  setEmbedColor(index: number, color: string): void;

  setEmbedTimestamp(index: number, timestamp: Date | null): void;

  setEmbedTimestampNow(index: number, timestampNow: boolean): void;

  setEmbedAuthorName(index: number, author: string): void;

  setEmbedAuthorIcon(index: number, icon: string): void;

  setEmbedAuthorUrl(index: number, url: string): void;

  setEmbedFooterText(index: number, text: string): void;
  setEmbedFooterIcon(index: number, icon: string): void;

  addField(index: number): void;
  clearFields(index: number): void;
  removeField(index: number, fieldIndex: number): void;
  setFieldName(index: number, fieldIndex: number, name: string): void;
  setFieldValue(index: number, fieldIndex: number, value: string): void;
  setFieldInline(index: number, fieldIndex: number, inline: boolean): void;
  setToPreviousField(index: number, fieldIndex: number): void;
  setToNextField(index: number, fieldIndex: number): void;

  reset(): void;
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
  color: "#ffffff",
  fields: [],
};

const defaultField: CompleteEmbedField = {
  name: "New member count",
  value: "{membercount}",
};

export const useWelcomerStore = create<WelcomerStore>()(
  immer((set) => ({
    ...defaultMessage,
    deletedEmbeds: [],
    deletedFields: [],
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
        if (state.embeds) {
          state.deletedEmbeds.push(state.embeds[index]);
          state.embeds.splice(index, 1);
        }
      }),
    setToPreviousEmbed: (index) =>
      set((state) => {
        if (state.embeds && index > 0) {
          const temp = state.embeds[index];
          state.embeds[index] = state.embeds[index - 1];
          state.embeds[index - 1] = temp;
        }
      }),
    setToNextEmbed: (index) =>
      set((state) => {
        if (state.embeds && index < state.embeds.length - 1) {
          const temp = state.embeds[index];
          state.embeds[index] = state.embeds[index + 1];
          state.embeds[index + 1] = temp;
        }
      }),
    clearEmbeds: () =>
      set((state) => {
        state.deletedEmbeds = state.embeds;
        state.embeds = [];
      }),
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
    setEmbedAuthorName: (index, author) =>
      set((state) => {
        if (state.embeds[index].author) {
          state.embeds[index].author.name = author;
        } else {
          state.embeds[index].author = { name: author };
        }
      }),
    setEmbedAuthorIcon: (index, icon) =>
      set((state) => {
        if (state.embeds[index].author) {
          state.embeds[index].author.iconUrl = icon;
        } else {
          state.embeds[index].author = { name: "", iconUrl: icon };
        }
      }),
    setEmbedAuthorUrl: (index, url) =>
      set((state) => {
        if (state.embeds[index].author) {
          state.embeds[index].author.url = url;
        }
      }),
    setEmbedTimestampNow: (index, timestampNow) =>
      set((state) => {
        state.embeds[index].timestampNow = timestampNow;
      }),
    setEmbedFooterText: (index, text) =>
      set((state) => {
        if (state.embeds[index].footer) {
          state.embeds[index].footer.text = text;
        } else {
          state.embeds[index].footer = { text };
        }
      }),
    setEmbedFooterIcon: (index, icon) =>
      set((state) => {
        if (state.embeds[index].footer) {
          state.embeds[index].footer.iconUrl = icon;
        } else {
          state.embeds[index].footer = { text: "", iconUrl: icon };
        }
      }),
    addField: (index) =>
      set((state) => {
        state.embeds[index].fields.push(defaultField);
      }),
    clearFields: (index) =>
      set((state) => {
        state.deletedFields = state.embeds[index].fields;
        state.embeds[index].fields = [];
      }),
    removeField: (index, fieldIndex) =>
      set((state) => {
        state.deletedFields.push(state.embeds[index].fields[fieldIndex]);
        state.embeds[index].fields.splice(fieldIndex, 1);
      }),
    setFieldName: (index, fieldIndex, name) =>
      set((state) => {
        state.embeds[index].fields[fieldIndex].name = name;
      }),
    setFieldValue: (index, fieldIndex, value) =>
      set((state) => {
        state.embeds[index].fields[fieldIndex].value = value;
      }),
    setFieldInline: (index, fieldIndex, inline) =>
      set((state) => {
        state.embeds[index].fields[fieldIndex].inline = inline;
      }),
    setToPreviousField: (index, fieldIndex) =>
      set((state) => {
        if (fieldIndex > 0) {
          const temp = state.embeds[index].fields[fieldIndex];
          state.embeds[index].fields[fieldIndex] =
            state.embeds[index].fields[fieldIndex - 1];
          state.embeds[index].fields[fieldIndex - 1] = temp;
        }
      }),
    setToNextField: (index, fieldIndex) =>
      set((state) => {
        if (fieldIndex < state.embeds[index].fields.length - 1) {
          const temp = state.embeds[index].fields[fieldIndex];
          state.embeds[index].fields[fieldIndex] =
            state.embeds[index].fields[fieldIndex + 1];
          state.embeds[index].fields[fieldIndex + 1] = temp;
        }
      }),
    reset: () =>
      set((state) => ({
        ...state,
        deletedEmbeds: [],
        deletedFields: [],
      })),
  }))
);
