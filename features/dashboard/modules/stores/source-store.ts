import { ImageCard, Source } from "@/generated/prisma/client";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  createMessageSlice,
  defaultEmbed,
  type MessageSlice,
} from "./message-slice";

export type SourceState = Source & {
  guildId: string;
  activeCard?: ImageCard;
  imagePosition?: "outside" | "embed";
  imageEmbedIndex?: number;
  /**
   * Snapshot of the persisted fields as of the last save — or of store
   * creation, which is the last save from the server's point of view.
   * `markSaved` re-adopts it after a successful write; nothing else moves it.
   */
  savedSnapshot: string;
};

type TrackedSourceFields = Pick<
  SourceState,
  "channelId" | "message" | "imagePosition" | "imageEmbedIndex"
>;

/** Only the fields `updateSource` persists — actions and timestamps excluded. */
const sourceSnapshot = (state: TrackedSourceFields) =>
  JSON.stringify([
    state.channelId,
    state.message,
    state.imagePosition,
    state.imageEmbedIndex,
  ]);

export const selectSourceHasChanges = (state: SourceStore) =>
  sourceSnapshot(state) !== state.savedSnapshot;

/** Source-level actions; message editing lives in {@link MessageSlice}. */
export type SourceActions = MessageSlice & {
  setChannelId: (channelId: string) => void;
  setImagePosition: (
    position?: "outside" | "embed",
    embedIndex?: number,
  ) => void;
  /** Adopt the current state as the new baseline for `selectSourceHasChanges`. */
  markSaved(): void;
  reset(): void;
};

export type SourceStore = SourceState & SourceActions;

const defaultState: Omit<SourceState, "savedSnapshot"> = {
  id: 0,
  activeCard: undefined,
  guildId: "",
  type: "WELCOMER",
  channelId: "",
  message: {
    content: "test",
    embeds: [defaultEmbed],
  },
  activeCardId: null,
  deleteAfter: 0,
  isActive: true,
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

export const createSourceStore = (initState?: Partial<Source>) => {
  return createStore<SourceStore>()(
    immer<SourceStore>((set, get, store) => {
      let imagePosition: "outside" | "embed" | undefined = undefined;
      let imageEmbedIndex: number | undefined = undefined;

      const embeds = initState?.message?.embeds;
      if (embeds && initState.activeCardId != null) {
        imagePosition = "outside";
        embeds.forEach((embed, index) => {
          if (embed.image && embed.image.url) {
            imagePosition = "embed";
            imageEmbedIndex = index;
          }
        });
      }

      const initial = {
        ...defaultState,
        imagePosition,
        imageEmbedIndex,
        ...initState,
      };

      return {
        ...initial,
        savedSnapshot: sourceSnapshot(initial),

        ...createMessageSlice(set, get, store),

        setChannelId: (channelId) =>
          set((state) => {
            state.channelId = channelId;
          }),
        setImagePosition: (position, embedIndex) =>
          set((state) => {
            const embeds = state.message?.embeds;

            if (position === undefined) {
              embeds?.forEach((embed) => {
                delete embed.image;
              });
              state.imagePosition = undefined;
              state.imageEmbedIndex = undefined;
              return;
            }

            if (
              state.imagePosition === "embed" &&
              state.imageEmbedIndex !== undefined
            ) {
              const oldEmbed = embeds?.[state.imageEmbedIndex];
              if (
                oldEmbed?.image &&
                (position !== "embed" || state.imageEmbedIndex !== embedIndex)
              ) {
                delete oldEmbed.image;
              }
            }

            if (position === "embed" && embedIndex == undefined) {
              embedIndex = 0;
            }

            if (position === "outside") {
              embedIndex = undefined;
            }

            state.imagePosition = position;
            state.imageEmbedIndex = embedIndex;
          }),
        markSaved: () => set({ savedSnapshot: sourceSnapshot(get()) }),
        // `getInitialState()` carries `savedSnapshot` too, so a reset restores
        // the baseline along with the fields — no separate bookkeeping.
        reset: () => {
          set(store.getInitialState());
        },
      };
    }),
  );
};
