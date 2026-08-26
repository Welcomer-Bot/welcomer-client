import {
  BaseCardConfig,
  DEFAULT_CONFIG,
  TextCard,
} from "@/components/dashboard/guild/image-editor/types";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ImageCardState = {
  id?: number;
  sourceId: number;
  data: BaseCardConfig;
  createdAt?: Date;
  updatedAt?: Date | null;
  /**
   * Snapshot of the persisted config as of the last save — or of store
   * creation, which is the last save from the server's point of view.
   * `markSaved` re-adopts it after a successful write; nothing else moves it.
   */
  savedSnapshot: string;
};

/** Only `data` is persisted by `updateImageCard`. */
const imageCardSnapshot = (state: Pick<ImageCardState, "data">) =>
  JSON.stringify(state.data);

export const selectImageCardHasChanges = (state: ImageCardStore) =>
  imageCardSnapshot(state) !== state.savedSnapshot;

export type ImageCardActions = {
  setMainText: (text: TextCard) => void;
  setMainTextContent: (content: string) => void;
  setMainTextColor: (color: string) => void;
  setMainTextFont: (font: string) => void;
  setMainTextSize: (size: number) => void;
  setMainTextWeight: (weight: string) => void;

  setNicknameText: (text: TextCard) => void;
  setNicknameTextContent: (content: string) => void;
  setNicknameTextColor: (color: string) => void;
  setNicknameTextFont: (font: string) => void;
  setNicknameTextSize: (size: number) => void;
  setNicknameTextWeight: (weight: string) => void;

  setSecondText: (text: TextCard) => void;
  setSecondTextContent: (content: string) => void;
  setSecondTextColor: (color: string) => void;
  setSecondTextFont: (font: string) => void;
  setSecondTextSize: (size: number) => void;
  setSecondTextWeight: (weight: string) => void;

  setBackgroundColor: (color: string | null) => void;
  setBackgroundImgURL: (url: string | null) => void;

  setAvatarBorderColor: (color: string | null) => void;

  updateConfig: (config: Partial<BaseCardConfig>) => void;

  /** Adopt the current state as the new baseline for `selectImageCardHasChanges`. */
  markSaved: () => void;
  reset: () => void;
};

export type ImageCardStore = ImageCardState & ImageCardActions;

type TextField = "mainText" | "nicknameText" | "secondText";

const defaultState: Omit<ImageCardState, "savedSnapshot"> = {
  sourceId: 0,
  data: DEFAULT_CONFIG,
};

export const createImageCardStore = (initState?: Partial<ImageCardState>) => {
  return createStore<ImageCardStore>()(
    immer<ImageCardStore>((set, get, store) => {
      const setTextField = <K extends keyof TextCard>(
        field: TextField,
        key: K,
        value: TextCard[K],
      ) =>
        set((state) => {
          const existing = state.data[field];
          if (!existing) {
            state.data[field] = { content: "", [key]: value } as TextCard;
          } else {
            existing[key] = value;
          }
        });

      const replaceTextField = (field: TextField, text: TextCard) =>
        set((state) => {
          state.data[field] = text;
        });

      const initial = { ...defaultState, ...initState };

      return {
        ...initial,
        savedSnapshot: imageCardSnapshot(initial),

        setMainText: (text) => replaceTextField("mainText", text),
        setMainTextContent: (content) =>
          setTextField("mainText", "content", content),
        setMainTextColor: (color) => setTextField("mainText", "color", color),
        setMainTextFont: (font) => setTextField("mainText", "font", font),
        setMainTextSize: (size) => setTextField("mainText", "size", size),
        setMainTextWeight: (weight) =>
          setTextField("mainText", "weight", weight),

        setNicknameText: (text) => replaceTextField("nicknameText", text),
        setNicknameTextContent: (content) =>
          setTextField("nicknameText", "content", content),
        setNicknameTextColor: (color) =>
          setTextField("nicknameText", "color", color),
        setNicknameTextFont: (font) =>
          setTextField("nicknameText", "font", font),
        setNicknameTextSize: (size) =>
          setTextField("nicknameText", "size", size),
        setNicknameTextWeight: (weight) =>
          setTextField("nicknameText", "weight", weight),

        setSecondText: (text) => replaceTextField("secondText", text),
        setSecondTextContent: (content) =>
          setTextField("secondText", "content", content),
        setSecondTextColor: (color) =>
          setTextField("secondText", "color", color),
        setSecondTextFont: (font) => setTextField("secondText", "font", font),
        setSecondTextSize: (size) => setTextField("secondText", "size", size),
        setSecondTextWeight: (weight) =>
          setTextField("secondText", "weight", weight),

        setBackgroundColor: (color) =>
          set((state) => {
            state.data.backgroundColor = color;
          }),
        setBackgroundImgURL: (url) =>
          set((state) => {
            state.data.backgroundImgURL = url;
          }),

        setAvatarBorderColor: (color) =>
          set((state) => {
            state.data.avatarBorderColor = color;
          }),
        updateConfig: (config) =>
          set((state) => {
            state.data = {
              ...state.data,
              ...config,
            };
          }),

        markSaved: () =>
          set({ savedSnapshot: imageCardSnapshot(get()) }),
        // `getInitialState()` carries `savedSnapshot` too, so a reset restores
        // the baseline along with the config — no separate bookkeeping.
        reset: () => {
          set(store.getInitialState());
        },
      };
    }),
  );
};
