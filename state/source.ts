import { Source } from "@/prisma/generated/client";
import { APIEmbed, APIEmbedField } from "discord.js";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type SourceState = Source & {
  guildId: string;
  modified: Partial<Source>;
};

export type SourceActions = {
  setChannelId: (channelId: string) => void;
  setContent: (content?: string | null) => void;
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
  reset(): void;
};
export type SourceStore = SourceState & SourceActions;

const defaultField: APIEmbedField = {
  name: "Field Name",
  value: "Field Value",
  inline: false,
};

const defaultEmbed: APIEmbed = {
  title: "New Embed",
  color: 0x0099ff,
  fields: [],
};

const defaultState: Source = {
  id: 0,
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

export const createSourceStore = (initState: Source = defaultState) => {
  return createStore<SourceStore>()(
    immer<SourceStore>((set) => {
      return {
        ...initState,
        modified: {},
        setChannelId: (channelId) =>
          set((state) => {
            state.modified.channelId = channelId;
          }),
        setContent: (content) =>
          set((state) => {
            state.modified.message = { content: content || "" };
          }),
        addEmbed: (embed) =>
          set((state) => {
            if (!state.modified.message) {
              state.modified.message = { embeds: [] };
            } else if (!state.modified.message.embeds) {
              state.modified.message.embeds = [];
            }
            state.modified.message.embeds!.push(embed ?? defaultEmbed);
          }),
        moveEmbedUp: (index) =>
          set((state) => {
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier les embeds originaux si pas encore modifiés
            if (
              state.message?.embeds &&
              state.modified.message.embeds.length < state.message.embeds.length
            ) {
              for (let i = 0; i < state.message.embeds.length; i++) {
                if (!state.modified.message.embeds[i]) {
                  state.modified.message.embeds[i] = {
                    ...state.message.embeds[i],
                  };
                }
              }
            }
            if (index <= 0 || index >= state.modified.message.embeds.length)
              return;
            const embeds = state.modified.message.embeds;
            [embeds[index - 1], embeds[index]] = [
              embeds[index],
              embeds[index - 1],
            ];
          }),
        moveEmbedDown: (index) =>
          set((state) => {
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier les embeds originaux si pas encore modifiés
            if (
              state.message?.embeds &&
              state.modified.message.embeds.length < state.message.embeds.length
            ) {
              for (let i = 0; i < state.message.embeds.length; i++) {
                if (!state.modified.message.embeds[i]) {
                  state.modified.message.embeds[i] = {
                    ...state.message.embeds[i],
                  };
                }
              }
            }
            if (index < 0 || index >= state.modified.message.embeds.length - 1)
              return;
            const embeds = state.modified.message.embeds;
            [embeds[index], embeds[index + 1]] = [
              embeds[index + 1],
              embeds[index],
            ];
          }),
        deleteEmbed: (index) =>
          set((state) => {
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier les embeds originaux si pas encore modifiés
            if (
              state.message?.embeds &&
              state.modified.message.embeds.length < state.message.embeds.length
            ) {
              for (let i = 0; i < state.message.embeds.length; i++) {
                if (!state.modified.message.embeds[i]) {
                  state.modified.message.embeds[i] = {
                    ...state.message.embeds[i],
                  };
                }
              }
            }
            if (index < 0 || index >= state.modified.message.embeds.length)
              return;
            state.modified.message.embeds!.splice(index, 1);
          }),
        editEmbed: (index, embed) =>
          set((state) => {
            // S'assurer que les embeds modifiés existent
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier l'embed original si pas encore modifié
            if (
              !state.modified.message.embeds[index] &&
              state.message?.embeds?.[index]
            ) {
              state.modified.message.embeds[index] = {
                ...state.message.embeds[index],
              };
            }
            // Appliquer la modification
            if (state.modified.message.embeds[index]) {
              state.modified.message.embeds[index] = embed;
            }
          }),
        clearEmbeds: () =>
          set((state) => {
            if (!state.modified.message) {
              state.modified.message = { embeds: [] };
            } else {
              state.modified.message.embeds = [];
            }
          }),
        moveFieldUp: (embedIndex, fieldIndex) =>
          set((state) => {
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier l'embed original si pas encore modifié
            if (
              !state.modified.message.embeds[embedIndex] &&
              state.message?.embeds?.[embedIndex]
            ) {
              state.modified.message.embeds[embedIndex] = {
                ...state.message.embeds[embedIndex],
              };
            }
            // Copier les fields originaux si pas encore modifiés
            if (
              !state.modified.message.embeds[embedIndex].fields &&
              state.message?.embeds?.[embedIndex]?.fields
            ) {
              state.modified.message.embeds[embedIndex].fields =
                state.message.embeds[embedIndex].fields.map((f) => ({ ...f }));
            }
            const fields = state.modified.message.embeds[embedIndex].fields!;
            if (fieldIndex <= 0 || fieldIndex >= fields.length) return;
            [fields[fieldIndex - 1], fields[fieldIndex]] = [
              fields[fieldIndex],
              fields[fieldIndex - 1],
            ];
          }),
        moveFieldDown: (embedIndex, fieldIndex) =>
          set((state) => {
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier l'embed original si pas encore modifié
            if (
              !state.modified.message.embeds[embedIndex] &&
              state.message?.embeds?.[embedIndex]
            ) {
              state.modified.message.embeds[embedIndex] = {
                ...state.message.embeds[embedIndex],
              };
            }
            // Copier les fields originaux si pas encore modifiés
            if (
              !state.modified.message.embeds[embedIndex].fields &&
              state.message?.embeds?.[embedIndex]?.fields
            ) {
              state.modified.message.embeds[embedIndex].fields =
                state.message.embeds[embedIndex].fields.map((f) => ({ ...f }));
            }
            const fields = state.modified.message.embeds[embedIndex].fields!;
            if (fieldIndex < 0 || fieldIndex >= fields.length - 1) return;
            [fields[fieldIndex], fields[fieldIndex + 1]] = [
              fields[fieldIndex + 1],
              fields[fieldIndex],
            ];
          }),
        deleteField: (embedIndex, fieldIndex) =>
          set((state) => {
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier l'embed original si pas encore modifié
            if (
              !state.modified.message.embeds[embedIndex] &&
              state.message?.embeds?.[embedIndex]
            ) {
              state.modified.message.embeds[embedIndex] = {
                ...state.message.embeds[embedIndex],
              };
            }
            // Copier les fields originaux si pas encore modifiés
            if (
              !state.modified.message.embeds[embedIndex].fields &&
              state.message?.embeds?.[embedIndex]?.fields
            ) {
              state.modified.message.embeds[embedIndex].fields =
                state.message.embeds[embedIndex].fields.map((f) => ({ ...f }));
            }
            const fields = state.modified.message.embeds[embedIndex].fields!;
            if (fieldIndex < 0 || fieldIndex >= fields.length) return;
            fields.splice(fieldIndex, 1);
          }),
        editField: (embedIndex, fieldIndex, field) =>
          set((state) => {
            // S'assurer que les embeds modifiés existent
            if (!state.modified.message) state.modified.message = {};
            if (!state.modified.message.embeds)
              state.modified.message.embeds = [];
            // Copier l'embed original si pas encore modifié
            if (
              !state.modified.message.embeds[embedIndex] &&
              state.message?.embeds?.[embedIndex]
            ) {
              state.modified.message.embeds[embedIndex] = {
                ...state.message.embeds[embedIndex],
              };
            }
            // S'assurer que les fields modifiés existent
            if (
              !state.modified.message.embeds[embedIndex].fields &&
              state.message?.embeds?.[embedIndex]?.fields
            ) {
              state.modified.message.embeds[embedIndex].fields =
                state.message.embeds[embedIndex].fields.map((f) => ({ ...f }));
            }
            const fields = state.modified.message.embeds[embedIndex].fields!;
            if (fieldIndex < 0 || fieldIndex >= fields.length) return;
            fields[fieldIndex] = {
              ...fields[fieldIndex],
              ...field,
            };
          }),
        addField: (embedIndex) =>
          set((state) => {
            if (
              !state.modified.message ||
              !state.modified.message.embeds ||
              !state.modified.message.embeds[embedIndex]
            ) {
              return;
            }
            if (!state.modified.message.embeds[embedIndex].fields) {
              state.modified.message.embeds[embedIndex].fields = [];
            }
            state.modified.message.embeds[embedIndex].fields!.push(
              defaultField
            );
          }),
        clearFields: (embedIndex) =>
          set((state) => {
            if (
              !state.modified.message ||
              !state.modified.message.embeds ||
              !state.modified.message.embeds[embedIndex]
            ) {
              return;
            }
            state.modified.message.embeds[embedIndex].fields = [];
          }),
        reset: () => set(() => ({ modified: {} })),
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
