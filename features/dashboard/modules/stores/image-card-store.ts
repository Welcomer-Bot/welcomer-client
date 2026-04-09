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
};

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

  reset: () => void;
};

export type ImageCardStore = ImageCardState & ImageCardActions;

const defaultState: ImageCardState = {
  sourceId: 0,
  data: DEFAULT_CONFIG,
};

export const createImageCardStore = (initState?: Partial<ImageCardState>) => {
  return createStore<ImageCardStore>()(
    immer<ImageCardStore>((set, get, store) => {
      return {
        ...defaultState,
        ...initState,

        setMainText: (text) =>
          set((state) => {
            state.data.mainText = text;
          }),
        setMainTextContent: (content) =>
          set((state) => {
            if (!state.data.mainText) {
              state.data.mainText = { content };
            } else {
              state.data.mainText.content = content;
            }
          }),
        setMainTextColor: (color) =>
          set((state) => {
            if (!state.data.mainText) {
              state.data.mainText = { content: "", color };
            } else {
              state.data.mainText.color = color;
            }
          }),
        setMainTextFont: (font) =>
          set((state) => {
            if (!state.data.mainText) {
              state.data.mainText = { content: "", font };
            } else {
              state.data.mainText.font = font;
            }
          }),
        setMainTextSize: (size) =>
          set((state) => {
            if (!state.data.mainText) {
              state.data.mainText = { content: "", size };
            } else {
              state.data.mainText.size = size;
            }
          }),
        setMainTextWeight: (weight) =>
          set((state) => {
            if (!state.data.mainText) {
              state.data.mainText = { content: "", weight };
            } else {
              state.data.mainText.weight = weight;
            }
          }),

        setNicknameText: (text) =>
          set((state) => {
            state.data.nicknameText = text;
          }),
        setNicknameTextContent: (content) =>
          set((state) => {
            if (!state.data.nicknameText) {
              state.data.nicknameText = { content };
            } else {
              state.data.nicknameText.content = content;
            }
          }),
        setNicknameTextColor: (color) =>
          set((state) => {
            if (!state.data.nicknameText) {
              state.data.nicknameText = { content: "", color };
            } else {
              state.data.nicknameText.color = color;
            }
          }),
        setNicknameTextFont: (font) =>
          set((state) => {
            if (!state.data.nicknameText) {
              state.data.nicknameText = { content: "", font };
            } else {
              state.data.nicknameText.font = font;
            }
          }),
        setNicknameTextSize: (size) =>
          set((state) => {
            if (!state.data.nicknameText) {
              state.data.nicknameText = { content: "", size };
            } else {
              state.data.nicknameText.size = size;
            }
          }),
        setNicknameTextWeight: (weight) =>
          set((state) => {
            if (!state.data.nicknameText) {
              state.data.nicknameText = { content: "", weight };
            } else {
              state.data.nicknameText.weight = weight;
            }
          }),

        setSecondText: (text) =>
          set((state) => {
            state.data.secondText = text;
          }),
        setSecondTextContent: (content) =>
          set((state) => {
            if (!state.data.secondText) {
              state.data.secondText = { content };
            } else {
              state.data.secondText.content = content;
            }
          }),
        setSecondTextColor: (color) =>
          set((state) => {
            if (!state.data.secondText) {
              state.data.secondText = { content: "", color };
            } else {
              state.data.secondText.color = color;
            }
          }),
        setSecondTextFont: (font) =>
          set((state) => {
            if (!state.data.secondText) {
              state.data.secondText = { content: "", font };
            } else {
              state.data.secondText.font = font;
            }
          }),
        setSecondTextSize: (size) =>
          set((state) => {
            if (!state.data.secondText) {
              state.data.secondText = { content: "", size };
            } else {
              state.data.secondText.size = size;
            }
          }),
        setSecondTextWeight: (weight) =>
          set((state) => {
            if (!state.data.secondText) {
              state.data.secondText = { content: "", weight };
            } else {
              state.data.secondText.weight = weight;
            }
          }),

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

        reset: () => {
          set(store.getInitialState());
        },
      };
    }),
  );
};

