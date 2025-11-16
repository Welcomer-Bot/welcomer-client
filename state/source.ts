import { ImageCard, Source } from "@/prisma/generated/client";
import {
  defaultEmbedField,
  defaultLeaverEmbed,
  defaultWelcomeEmbed,
} from "@/types/embed";
import { APIEmbed } from "discord.js";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type SourceState = Source & {
  guildId: string;
  activeCard?: ImageCard;
  imagePosition?: "outside" | "embed";
  imageEmbedIndex?: number;
};

export type SourceActions = {
  setChannelId: (channelId: string) => void;
  setContent: (content?: string) => void;
  addEmbed: (embed?: APIEmbed) => void;
  moveEmbedUp: (index: number) => void;
  moveEmbedDown: (index: number) => void;
  deleteEmbed: (index: number) => void;
  editEmbed: (index: number, embed: APIEmbed) => void;
  clearEmbeds: () => void;
  moveFieldUp: (embedIndex: number, fieldIndex: number) => void;
  moveFieldDown: (embedIndex: number, fieldIndex: number) => void;
  deleteField: (embedIndex: number, fieldIndex: number) => void;
  editField: (
    embedIndex: number,
    fieldIndex: number,
    field: { name?: string; value?: string; inline?: boolean }
  ) => void;
  addField: (embedIndex: number) => void;
  clearFields: (embedIndex: number) => void;
  setImagePosition: (
    position: "outside" | "embed",
    embedIndex?: number
  ) => void;
  reset(): void;
};
export type SourceStore = SourceState & SourceActions;

const defaultEmbed: APIEmbed = {
  title: "New Embed",
  color: 0x0099ff,
  fields: [],
};

const defaultState: SourceState = {
  id: 0,
  activeCard: undefined,
  guildId: "",
  type: "Welcomer",
  channelId: "",
  message: {
    content: "test",
    embeds: [defaultEmbed],
  },
  activeCardId: null,
  createdAt: null,
  updatedAt: null,
  deleteAfter: null,
};

export const createSourceStore = (initState?: Partial<Source>) => {
  return createStore<SourceStore>()(
    immer<SourceStore>((set, get, store) => {
      // Determine initial image position from embeds
      let imagePosition: "outside" | "embed" = "outside";
      let imageEmbedIndex: number | undefined = undefined;

      const embeds = initState?.message?.embeds;
      if (embeds) {
        embeds.forEach((embed, index) => {
          if (embed.image && embed.image.url) {
            imagePosition = "embed";
            imageEmbedIndex = index;
          }
        });
      }

      return {
        ...defaultState,
        imagePosition,
        imageEmbedIndex,
        ...initState,
        setChannelId: (channelId) =>
          set((state) => {
            state.channelId = channelId;
          }),
        setContent: (content) =>
          set((state) => {
            if (!state.message) {
              state.message = { content: undefined };
            }

            state.message.content = content;
          }),
        addEmbed: (embed) =>
          set((state) => {
            if (!state.message) {
              state.message = { embeds: [] };
            } else if (!state.message.embeds) {
              state.message.embeds = [];
            }
            if (state.type === "Welcomer" && !embed) {
              embed = defaultWelcomeEmbed;
            } else if (state.type === "Leaver" && !embed) {
              embed = defaultLeaverEmbed;
            }
            state.message.embeds!.push(embed ?? defaultEmbed);
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
            [embeds[index - 1], embeds[index]] = [
              embeds[index],
              embeds[index - 1],
            ];
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
            [embeds[index], embeds[index + 1]] = [
              embeds[index + 1],
              embeds[index],
            ];
          }),
        deleteEmbed: (index) =>
          set((state) => {
            if (!state.message) state.message = {};
            if (!state.message.embeds) state.message.embeds = [];

            if (index < 0 || index >= state.message.embeds.length) return;
            state.message.embeds!.splice(index, 1);
          }),
        editEmbed: (index, embed) =>
          set((state) => {
            if (!state.message) state.message = {};
            if (!state.message.embeds) state.message.embeds = [];
            // Appliquer la modification
            if (state.message.embeds[index]) {
              state.message.embeds[index] = embed;
            }
          }),
        clearEmbeds: () =>
          set((state) => {
            if (state.message) {
              state.message.embeds = [];
            } else state.message = { embeds: [] };
          }),

        addField: (embedIndex) =>
          set((state) => {
            if (
              !state.message ||
              !state.message.embeds ||
              !state.message.embeds[embedIndex]
            ) {
              return;
            }
            if (!state.message.embeds[embedIndex].fields) {
              state.message.embeds[embedIndex].fields = [];
            }
            state.message.embeds[embedIndex].fields!.push(defaultEmbedField);
          }),
        moveFieldUp: (embedIndex: number, fieldIndex: number) =>
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
        moveFieldDown: (embedIndex: number, fieldIndex: number) =>
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
        clearFields: (embedIndex) =>
          set((state) => {
            if (
              !state.message ||
              !state.message.embeds ||
              !state.message.embeds[embedIndex]
            ) {
              return;
            }
            state.message.embeds[embedIndex].fields = [];
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
        setImagePosition: (position, embedIndex) =>
          set((state) => {
            state.imagePosition = position;
            state.imageEmbedIndex = embedIndex;
          }),
        reset: () => {
          set(store.getInitialState());
        },
      };
    })
  );
};

// export const extractSourceState = (data: SourceStore): SourceState => {
//   const {
//     id,
//     guildId,
//     channelId,
//     type,
//     content,
//     embeds,
//     images,
//     activeCardId,
//     activeCardToEmbedId,
//     deletedEmbeds,
//     deletedFields,
//     edited,
//     initialState,
//   } = data;

//   return {
//     id,
//     guildId,
//     channelId,
//     type,
//     content,
//     embeds,
//     images,
//     activeCardId,
//     activeCardToEmbedId,
//     deletedEmbeds,
//     deletedFields,
//     edited,
//     initialState,
//   };
// };
