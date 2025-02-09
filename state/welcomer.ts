import { Welcomer } from "@/lib/discord/schema";
import { CompleteEmbed, CompleteEmbedField } from "@/prisma/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface WelcomerStore extends Welcomer {
  deletedEmbeds: CompleteEmbed[];
  deletedFields: CompleteEmbedField[];
  edited: boolean;

  setEdited: (edited: boolean) => void;
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

  setActiveCardEmbedPosition(position: number): void;

  reset(): void;
}

const defaultMessage: Welcomer = {
  guildId: "",
  channelId: "",
  content: "Welcome {user} to {guild}",
  embeds: [],
  activeCardId: null,
  images: [],
  activeCardToEmbedId: null,
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
  immer<WelcomerStore>((set, get) => {
    const customSet = (fn: (state: WelcomerStore) => void) => {
      set((state) => {
        fn(state);
        state.edited = true;
      });
    };

    return {
      ...defaultMessage,
      deletedEmbeds: [],
      deletedFields: [],
      edited: false,
      activeCardEmbedPosition: null,
      setEdited: (edited) =>
        set((state) => {
          state.edited = edited;
        }),
      setGuildId: (guildId) =>
        customSet((state) => {
          state.guildId = guildId;
        }),
      setChannelId: (channelId) =>
        customSet((state) => {
          state.channelId = channelId;
        }),
      setContent: (content) =>
        customSet((state) => {
          state.content = content;
        }),

      clear: () =>
        set((state) => {
          Object.assign(state, defaultMessage);
          state.deletedEmbeds = [];
          state.deletedFields = [];
          state.edited = false;
        }),

      addEmbed: (embed) =>
        customSet((state) => {
          if (!state.embeds) {
            state.embeds = [embed];
          } else {
            state.embeds.push(embed);
          }
        }),

      addDefaultEmbed: () =>
        customSet((state) => {
          if (!state.embeds) {
            state.embeds = [defaultEmbed];
          } else {
            state.embeds.push(defaultEmbed);
          }
        }),

      removeEmbed: (index) =>
        customSet((state) => {
          if (state.embeds) {
            state.deletedEmbeds.push(state.embeds[index]);
            state.embeds.splice(index, 1);
          }
        }),

      setToPreviousEmbed: (index) =>
        customSet((state) => {
          if (state.embeds && index > 0) {
            const temp = state.embeds[index];
            state.embeds[index] = state.embeds[index - 1];
            state.embeds[index - 1] = temp;
            if (state.activeCardToEmbedId === index) {
              state.activeCardToEmbedId = index - 1;
            }else if (state.activeCardToEmbedId === index - 1) {
              state.activeCardToEmbedId = index;
            }

          }
        }),

      setToNextEmbed: (index) =>
        customSet((state) => {
          if (state.embeds && index < state.embeds.length - 1) {
            const temp = state.embeds[index];
            state.embeds[index] = state.embeds[index + 1];
            state.embeds[index + 1] = temp;
            if (state.activeCardToEmbedId === index) {
              state.activeCardToEmbedId = index + 1;
            } else if (state.activeCardToEmbedId === index + 1) {
              state.activeCardToEmbedId = index;
            }
          }
        }),

      clearEmbeds: () =>
        customSet((state) => {
          state.deletedEmbeds = state.embeds;
          state.embeds = [];
        }),

      setEmbedTitle: (index, title) =>
        customSet((state) => {
          state.embeds[index].title = title;
        }),

      setEmbedDescription: (index, description) =>
        customSet((state) => {
          state.embeds[index].description = description;
        }),

      setEmbedColor: (index, color) =>
        customSet((state) => {
          state.embeds[index].color = color;
        }),

      setEmbedTimestamp: (index, timestamp) =>
        customSet((state) => {
          state.embeds[index].timestamp = timestamp;
        }),

      setEmbedTimestampNow: (index, timestampNow) =>
        customSet((state) => {
          state.embeds[index].timestampNow = timestampNow;
        }),

      setEmbedAuthorName: (index, author) =>
        customSet((state) => {
          if (state.embeds[index].author) {
            state.embeds[index].author.name = author;
          } else {
            state.embeds[index].author = { name: author };
          }
        }),

      setEmbedAuthorIcon: (index, icon) =>
        customSet((state) => {
          if (state.embeds[index].author) {
            state.embeds[index].author.iconUrl = icon;
          } else {
            state.embeds[index].author = { name: "", iconUrl: icon };
          }
        }),

      setEmbedAuthorUrl: (index, url) =>
        customSet((state) => {
          if (state.embeds[index].author) {
            state.embeds[index].author.url = url;
          }
        }),

      setEmbedFooterText: (index, text) =>
        customSet((state) => {
          if (state.embeds[index].footer) {
            state.embeds[index].footer.text = text;
          } else {
            state.embeds[index].footer = { text };
          }
        }),

      setEmbedFooterIcon: (index, icon) =>
        customSet((state) => {
          if (state.embeds[index].footer) {
            state.embeds[index].footer.iconUrl = icon;
          } else {
            state.embeds[index].footer = { text: "", iconUrl: icon };
          }
        }),

      addField: (index) =>
        customSet((state) => {
          state.embeds[index].fields.push(defaultField);
        }),

      clearFields: (index) =>
        customSet((state) => {
          state.deletedFields = state.embeds[index].fields;
          state.embeds[index].fields = [];
        }),

      removeField: (index, fieldIndex) =>
        customSet((state) => {
          state.deletedFields.push(state.embeds[index].fields[fieldIndex]);
          state.embeds[index].fields.splice(fieldIndex, 1);
        }),

      setFieldName: (index, fieldIndex, name) =>
        customSet((state) => {
          state.embeds[index].fields[fieldIndex].name = name;
        }),

      setFieldValue: (index, fieldIndex, value) =>
        customSet((state) => {
          state.embeds[index].fields[fieldIndex].value = value;
        }),

      setFieldInline: (index, fieldIndex, inline) =>
        customSet((state) => {
          state.embeds[index].fields[fieldIndex].inline = inline;
        }),

      setToPreviousField: (index, fieldIndex) =>
        customSet((state) => {
          if (fieldIndex > 0) {
            const temp = state.embeds[index].fields[fieldIndex];
            state.embeds[index].fields[fieldIndex] =
              state.embeds[index].fields[fieldIndex - 1];
            state.embeds[index].fields[fieldIndex - 1] = temp;
          }
        }),

      setToNextField: (index, fieldIndex) =>
        customSet((state) => {
          if (fieldIndex < state.embeds[index].fields.length - 1) {
            const temp = state.embeds[index].fields[fieldIndex];
            state.embeds[index].fields[fieldIndex] =
              state.embeds[index].fields[fieldIndex + 1];
            state.embeds[index].fields[fieldIndex + 1] = temp;
          }
        }),
      setActiveCardEmbedPosition: (position) =>
        customSet((state) => {
          state.activeCardToEmbedId = position;
        }),

      reset: () =>
        set((state) => ({
          ...state,
          deletedEmbeds: [],
          deletedFields: [],
          edited: false,
          activeCardToEmbedId: null,
        })),
    };
  })
);
