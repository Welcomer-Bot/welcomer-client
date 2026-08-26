import {
  defaultEmbedField,
  defaultLeaverEmbed,
  defaultWelcomeEmbed,
} from "@/types/embed";
import { APIEmbed } from "discord.js";
import type { StateCreator } from "zustand";

import type { SourceStore } from "./source-store";

export const defaultEmbed: APIEmbed = {
  title: "New Embed",
  color: 0x0099ff,
  fields: [],
};

/** Everything that edits `state.message` — embeds and their fields. */
export type MessageSlice = {
  setContent: (content?: string) => void;
  addEmbed: (embed?: APIEmbed) => void;
  moveEmbedUp: (index: number) => void;
  moveEmbedDown: (index: number) => void;
  deleteEmbed: (index: number) => void;
  editEmbed: (index: number, embed: APIEmbed) => void;
  clearEmbeds: () => void;
  addField: (embedIndex: number) => void;
  moveFieldUp: (embedIndex: number, fieldIndex: number) => void;
  moveFieldDown: (embedIndex: number, fieldIndex: number) => void;
  deleteField: (embedIndex: number, fieldIndex: number) => void;
  editField: (
    embedIndex: number,
    fieldIndex: number,
    field: { name?: string; value?: string; inline?: boolean },
  ) => void;
  clearFields: (embedIndex: number) => void;
};

/**
 * Message-editing slice, per the Zustand "slices pattern".
 *
 * Typed against the whole `SourceStore` because `addEmbed` reads `state.type`
 * to pick the module's default embed — the slice owns the message tree, not
 * the source metadata around it.
 */
export const createMessageSlice: StateCreator<
  SourceStore,
  [["zustand/immer", never]],
  [],
  MessageSlice
> = (set) => ({
  setContent: (content) =>
    set((state) => {
      state.message = state.message ?? {};
      state.message.content = content;
    }),
  addEmbed: (embed) =>
    set((state) => {
      state.message = state.message ?? { embeds: [] };
      state.message.embeds = state.message.embeds ?? [];

      if (state.type === "WELCOMER" && !embed) {
        embed = defaultWelcomeEmbed;
      } else if (state.type === "LEAVER" && !embed) {
        embed = defaultLeaverEmbed;
      }
      state.message.embeds.push(embed ?? defaultEmbed);
    }),
  moveEmbedUp: (index) =>
    set((state) => {
      if (
        !state.message?.embeds ||
        index <= 0 ||
        index >= state.message.embeds.length
      )
        return;
      const embeds = state.message.embeds;
      [embeds[index - 1], embeds[index]] = [embeds[index], embeds[index - 1]];
    }),
  moveEmbedDown: (index) =>
    set((state) => {
      if (
        !state.message?.embeds ||
        index < 0 ||
        index >= state.message.embeds.length - 1
      )
        return;
      const embeds = state.message.embeds;
      [embeds[index], embeds[index + 1]] = [embeds[index + 1], embeds[index]];
    }),
  deleteEmbed: (index) =>
    set((state) => {
      if (
        !state.message?.embeds ||
        index < 0 ||
        index >= state.message.embeds.length
      ) {
        return;
      }
      state.message.embeds.splice(index, 1);
    }),
  editEmbed: (index, embed) =>
    set((state) => {
      if (!state.message?.embeds?.[index]) {
        return;
      }
      state.message.embeds[index] = embed;
    }),
  clearEmbeds: () =>
    set((state) => {
      state.message = state.message ?? {};
      state.message.embeds = [];
    }),

  addField: (embedIndex) =>
    set((state) => {
      const embed = state.message?.embeds?.[embedIndex];
      if (!embed) {
        return;
      }
      embed.fields = embed.fields ?? [];
      embed.fields.push(defaultEmbedField);
    }),
  moveFieldUp: (embedIndex, fieldIndex) =>
    set((state) => {
      const embed = state.message?.embeds?.[embedIndex];
      if (
        !embed ||
        !embed.fields ||
        fieldIndex <= 0 ||
        fieldIndex >= embed.fields.length
      )
        return;
      const fields = embed.fields;
      [fields[fieldIndex - 1], fields[fieldIndex]] = [
        fields[fieldIndex],
        fields[fieldIndex - 1],
      ];
    }),
  moveFieldDown: (embedIndex, fieldIndex) =>
    set((state) => {
      const embed = state.message?.embeds?.[embedIndex];
      if (
        !embed ||
        !embed.fields ||
        fieldIndex < 0 ||
        fieldIndex >= embed.fields.length - 1
      )
        return;
      const fields = embed.fields;
      [fields[fieldIndex], fields[fieldIndex + 1]] = [
        fields[fieldIndex + 1],
        fields[fieldIndex],
      ];
    }),
  deleteField: (embedIndex, fieldIndex) =>
    set((state) => {
      const embed = state.message?.embeds?.[embedIndex];
      if (
        !embed ||
        !embed.fields ||
        fieldIndex < 0 ||
        fieldIndex >= embed.fields.length
      )
        return;
      embed.fields.splice(fieldIndex, 1);
    }),
  editField: (embedIndex, fieldIndex, field) =>
    set((state) => {
      const embed = state.message?.embeds?.[embedIndex];
      if (
        !embed ||
        !embed.fields ||
        fieldIndex < 0 ||
        fieldIndex >= embed.fields.length
      )
        return;
      embed.fields[fieldIndex] = {
        ...embed.fields[fieldIndex],
        ...field,
      };
    }),
  clearFields: (embedIndex) =>
    set((state) => {
      const embed = state.message?.embeds?.[embedIndex];
      if (!embed) {
        return;
      }
      embed.fields = [];
    }),
});
