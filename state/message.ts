import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { EmbedField, Message, MessageEmbed } from "@/lib/discord/schema";

export interface MessageStore extends Message {
  setEmbedUrl: (i: number, url: string | undefined) => void;
  setEmbedAuthorName: (i: number, name: string) => void;
  setEmbedAuthorUrl: (i: number, url: string | undefined) => void;
  setEmbedAuthorIconUrl: (i: number, icon_url: string | undefined) => void;
  setEmbedThumbnailUrl: (i: number, url: string | undefined) => void;
  setEmbedImageUrl: (i: number, url: string | undefined) => void;
  setEmbedFooterText: (i: number, text: string | undefined) => void;
  setEmbedFooterIconUrl: (i: number, icon_url: string | undefined) => void;
  setEmbedColor: (i: number, color: number | undefined) => void;
  setEmbedTimestamp: (i: number, timestamp: string | undefined) => void;
  addEmbedField: (i: number, field: EmbedField) => void;
  setEmbedFieldName: (i: number, j: number, name: string) => void;
  setEmbedFieldValue: (i: number, j: number, value: string) => void;
  setEmbedFieldInline: (
    i: number,
    j: number,
    inline: boolean | undefined,
  ) => void;
  moveEmbedFieldDown: (i: number, j: number) => void;
  moveEmbedFieldUp: (i: number, j: number) => void;
  deleteEmbedField: (i: number, j: number) => void;
  clearEmbedFields: (i: number) => void;

  clear(): void;

  replace(message: Message): void;

  setContent(content: string): void;

  addEmbed(embed: MessageEmbed): void;

  clearEmbeds(): void;

  setEmbeds(embeds: MessageEmbed[]): void;

  deleteEmbed(index: number): void;

  setEmbedTitle(index: number, title: string | undefined): void;

  setEmbedDescription(index: number, description: string | undefined): void;
}

export const defaultMessage: Message = {
  content: "Welcome {user} to {guild}! You are the {memberCount} member.",
  embeds: [],
};

export const emptyMessage: Message = {
  content: "",
  embeds: [],
};

export const createMessageStore = (key: string) =>
  create<MessageStore>()(
    immer(
      persist(
        (set, get) => ({
          ...defaultMessage,
          clear: () => set(defaultMessage),
          replace: (message) => set(message),
          setContent: (content) => set({ content }),
          addEmbed: (embed: MessageEmbed) =>
            set((state) => {
              if (!state.embeds) {
                state.embeds = [embed];
              } else {
                state.embeds.push(embed);
              }
            }),
          clearEmbeds: () => set({ embeds: [] }),
          deleteEmbed: (index) => {
            set((state) => {
              if (!state.embeds) return;
              state.embeds.splice(index, 1);
            });
          },
          setEmbeds: (embeds) => set({ embeds }),
          setEmbedTitle: (index: number, title: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[index]) {
                state.embeds[index].title = title;
              }
            });
          },
          setEmbedDescription: (
            index: number,
            description: string | undefined,
          ) => {
            set((state) => {
              if (state.embeds && state.embeds[index]) {
                state.embeds[index].description = description;
              }
            });
          },
          setEmbedUrl: (i: number, url: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].url = url;
              }
            });
          },
          setEmbedAuthorName: (i: number, name: string) => {
            set((state) => {
              const embed = state.embeds && state.embeds[i];

              if (!embed) {
                return;
              }
              if (!name) {
                if (!embed.author) {
                  return;
                }

                embed.author.name = name;
                if (!embed.author.icon_url && !embed.author.url) {
                  embed.author = undefined;
                }
              } else {
                if (!embed.author) {
                  embed.author = { name };
                } else {
                  embed.author.name = name;
                }
              }
            });
          },
          setEmbedAuthorUrl: (i: number, url: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                if (!state.embeds[i].author) {
                  state.embeds[i].author = {};
                }
                state.embeds[i].author.url = url;
              }
            });
          },
          setEmbedAuthorIconUrl: (i: number, icon_url: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                if (!state.embeds[i].author) {
                  state.embeds[i].author = {};
                }
                state.embeds[i].author.icon_url = icon_url;
              }
            });
          },
          setEmbedThumbnailUrl: (i: number, url: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].thumbnail = { url };
              }
            });
          },
          setEmbedImageUrl: (i: number, url: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].image = { url };
              }
            });
          },
          setEmbedFooterText: (i: number, text: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].footer = { text };
              }
            });
          },
          setEmbedFooterIconUrl: (i: number, icon_url: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                if (!state.embeds[i].footer) {
                  state.embeds[i].footer = {};
                }
                state.embeds[i].footer.icon_url = icon_url;
              }
            });
          },
          setEmbedColor: (i: number, color: number | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].color = color;
              }
            });
          },
          setEmbedTimestamp: (i: number, timestamp: string | undefined) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].timestamp = timestamp;
              }
            });
          },
          addEmbedField: (i: number, field: EmbedField) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                if (!state.embeds[i].fields) {
                  state.embeds[i].fields = [field];
                } else {
                  state.embeds[i].fields.push(field);
                }
              }
            });
          },
          setEmbedFieldName: (i: number, j: number, name: string) => {
            set((state) => {
              if (state.embeds && state.embeds[i] && state.embeds[i].fields) {
                state.embeds[i].fields[j].name = name;
              }
            });
          },
          setEmbedFieldValue: (i: number, j: number, value: string) => {
            set((state) => {
              if (state.embeds && state.embeds[i] && state.embeds[i].fields) {
                state.embeds[i].fields[j].value = value;
              }
            });
          },
          setEmbedFieldInline: (
            i: number,
            j: number,
            inline: boolean | undefined,
          ) => {
            set((state) => {
              if (state.embeds && state.embeds[i] && state.embeds[i].fields) {
                state.embeds[i].fields[j].inline = inline;
              }
            });
          },
          moveEmbedFieldDown: (i: number, j: number) => {
            set((state) => {
              if (
                state.embeds &&
                state.embeds[i] &&
                state.embeds[i].fields &&
                state.embeds[i].fields[j]
              ) {
                const field = state.embeds[i].fields[j];

                state.embeds[i].fields[j] = state.embeds[i].fields[j + 1];
                state.embeds[i].fields[j + 1] = field;
              }
            });
          },
          moveEmbedFieldUp: (i: number, j: number) => {
            set((state) => {
              if (
                state.embeds &&
                state.embeds[i] &&
                state.embeds[i].fields &&
                state.embeds[i].fields[j]
              ) {
                const field = state.embeds[i].fields[j];

                state.embeds[i].fields[j] = state.embeds[i].fields[j - 1];
                state.embeds[i].fields[j - 1] = field;
              }
            });
          },
          deleteEmbedField: (i: number, j: number) => {
            set((state) => {
              if (state.embeds && state.embeds[i] && state.embeds[i].fields) {
                state.embeds[i].fields.splice(j, 1);
              }
            });
          },
          clearEmbedFields: (i: number) => {
            set((state) => {
              if (state.embeds && state.embeds[i]) {
                state.embeds[i].fields = [];
              }
            });
          },
        }),
        {
          name: key,
        },
      ),
    ),
  );

export const useCurrentMessageStore = createMessageStore("currentMessage");
