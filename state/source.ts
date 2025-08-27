import { Source } from "@/prisma/generated/client";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type SourceState = Source & {
  modified: Partial<Source>;
};

export type SourceActions = {
  setChannelId: (channelId: string) => void;
  setContent: (content?: string | null) => void;

  reset(): void;
};
export type SourceStore = SourceState & SourceActions;
const defaultState: Source = {
  id: 0,
  guildId: "",
  type: "Welcomer",
  channelId: "",
  message: {
    content: "test",
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
