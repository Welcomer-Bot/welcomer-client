import { ImageCard, ImageCardText } from "@/lib/discord/schema";
import { ImageTextType } from "@/types";
import { Color } from "@welcomer-bot/card-canvas";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ImageStore {
  moduleId: number | null;
  imageCards: (ImageCard & { imagePreview?: string })[];
  activeCard: number | null;
  removedText: ImageCardText[];
  edited : boolean;
  setModuleId: (id: number) => void;
  setActiveCard: (index: number) => void;
  getActiveCard: () => ImageCard | null;
  setPreviewImage: (image: string) => void;
  createCard: () => void;
  deleteCard: (index: number) => void;
  setBackgroundUrl: (backgroundUrl: string) => void;
  setBackgroundColor: (backgroundColor: Color) => void;
  setMainText: (mainText: ImageCardText) => void;
  setSecondText: (secondText: ImageCardText) => void;
  setTextContent: (textType: ImageTextType, content: string) => void;
  setTextColor: (textType: ImageTextType, color: Color) => void;
  setTextFont: (textType: ImageTextType, font: string) => void;
  // setMainTextContent: (content: string) => void;
  // setSecondTextContent: (content: string) => void;
  // setMainTextColor: (color: Color) => void;
  // setSecondTextColor: (color: Color) => void;
  // setMainTextFont: (font: string) => void;
  // setSecondTextFont: (font: string) => void;
  removeText: (textType: ImageTextType) => void;
  addText: (textType: ImageTextType) => void;
  // parseCardText: (user: User, guild: UserGuild) => BaseCardParams|null;
}

const defaultMainText: ImageCardText = {
  content: "Welcome {user} to the server!",
  color: "#ffffff",
  font: "Arial",
};

const defaultSecondText: ImageCardText = {
  content: "You are the {memberCount} member!",
  color: "#ffffff",
  font: "Arial",
};

const defaultNicknameText: ImageCardText = {
  content: "{username}",
  color: "#ffffff",
  font: "Arial",
};

const defaultImage: ImageCard & { imagePreview?: string } = {
  mainText: defaultMainText,
  secondText: defaultSecondText,
  nicknameText: defaultNicknameText,
};

export const useImageStore = create<ImageStore>()(
  immer((set, get) => {
    const setToActive = (
      fn: (state: ImageStore & { activeCard: number }) => void
    ) => {
      set((state) => {
        if (
          state.activeCard === null ||
          state.imageCards[state.activeCard] === undefined
        )
          return console.log("No active card");
        state.edited = true;
        fn(state as ImageStore & { activeCard: number });
      });
    };

    return {
      moduleId: null,
      imageCards: [],
      activeCard: null,
      removedText: [],
      edited: false,
      setActiveCard: (index) =>
        set((state) => {
          state.activeCard = index;
        }),
      setModuleId: (id) =>
        set((state) => {
          state.moduleId = id;
        }),

      getActiveCard: () => {
        const state = get();
        if (state.activeCard === null) {
          console.log("No active card, got null");
          return null;
        }
        return state.imageCards[state.activeCard];
      },
      setPreviewImage: (image) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard]) {
            state.imageCards[state.activeCard].imagePreview = image;
          } else {
            console.log("No active card");
          }
        }),

      createCard: () =>
        set((state) => {
          const index = state.imageCards.push(defaultImage);
          state.activeCard = index - 1;
        }),
      deleteCard: (index) =>
        set((state) => {
          state.imageCards.splice(index, 1);
        }),
      setBackgroundUrl: (backgroundUrl) =>
        setToActive((state) => {
          state.imageCards[state.activeCard].backgroundUrl = backgroundUrl;
        }),
      setBackgroundColor: (backgroundColor) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard]) {
            if (state.imageCards[state.activeCard].backgroundColor) {
              state.imageCards[state.activeCard].backgroundColor =
                backgroundColor;
            }
          } else {
            state.imageCards[state.activeCard].backgroundColor =
              backgroundColor;
          }
        }),
      setMainText: (mainText) =>
        setToActive((state) => {
          state.imageCards[state.activeCard].mainText = mainText;
        }),
      setSecondText: (secondText) =>
        setToActive((state) => {
          state.imageCards[state.activeCard].secondText = secondText;
        }),
      setTextContent: (textType, content) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard][textType]) {
            state.imageCards[state.activeCard][textType]!.content = content;
          } else {
            state.imageCards[state.activeCard][textType] = {
              ...(textType === "mainText"
                ? defaultMainText
                : textType === "secondText"
                  ? defaultSecondText
                  : defaultNicknameText),
              content,
            };
          }
        }),

      setTextColor: (textType, color) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard][textType]) {
            state.imageCards[state.activeCard][textType]!.color = color;
          } else {
            state.imageCards[state.activeCard][textType] = {
              ...(textType === "mainText"
                ? defaultMainText
                : textType === "secondText"
                  ? defaultSecondText
                  : defaultNicknameText),
              color,
            };
          }
        }),
      setTextFont: (textType, font) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard][textType]) {
            state.imageCards[state.activeCard][textType]!.font = font;
          } else {
            state.imageCards[state.activeCard][textType] = {
              ...(textType === "mainText"
                ? defaultMainText
                : textType === "secondText"
                  ? defaultSecondText
                  : defaultNicknameText),
              font,
            };
          }
        }),
      removeText: (textType) =>
        setToActive((state) => {
          const text = state.imageCards[state.activeCard][textType];
          if (text) {
            state.removedText.push(text);
          }
          state.imageCards[state.activeCard][textType] = undefined;
        }),
      addText: (textType) =>
        setToActive((state) => {
          state.imageCards[state.activeCard][textType] =
            textType === "mainText"
              ? defaultMainText
              : textType === "secondText"
                ? defaultSecondText
                : defaultNicknameText;
        }),
    };
  })
);
