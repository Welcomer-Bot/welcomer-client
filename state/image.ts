import { ImageCard, ImageCardText } from "@/lib/discord/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ImageStore {
  imageCards: ImageCard[];
  activeCard: ImageCard | null;
  setActiveCard: (index: number) => void;
  getActiveCard: () => ImageCard | null;
  createCard: () => void;
  deleteCard: (index: number) => void;
  setBackgroundUrl: (backgroundUrl: string) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setMainText: (mainText: ImageCardText) => void;
  setSecondText: (secondText: ImageCardText) => void;
  setMainTextContent: (content: string) => void;
  setSecondTextContent: (content: string) => void;
  setMainTextColor: (color: string) => void;
  setSecondTextColor: (color: string) => void;
  setMainTextFont: (font: string) => void;
  setSecondTextFont: (font: string) => void;
}

const defaultMainText: ImageCardText = {
  content: "Welcome {user} to the server!",
  color: "#ffffff",
};

const defaultSecondText: ImageCardText = {
  content: "You are the {memberCount} member!",
  color: "#ffffff",
};

const nicknameText: ImageCardText = {
  content: "{username}",
  color: "#ffffff",
};

const defaultImage: ImageCard = {
  backgroundUrl: "",
  backgroundColor: "#000000",
  mainText: defaultMainText,
  secondText: defaultSecondText,
  nicknameText: nicknameText,
};

export const useImageStore = create<ImageStore>()(
  immer((set, get) => {
    const setToActive = (
      fn: (state: ImageStore & { activeCard: ImageCard }) => void
    ) => {
      set((state) => {
        if (!state.activeCard) return;
        fn(state as ImageStore & { activeCard: ImageCard });
      });
    };

    return {
      imageCards: [],
      activeCard: null,
      setActiveCard: (index) =>
        set((state) => {
          state.activeCard = state.imageCards[index];
        }),
      getActiveCard: () => {
        return get().activeCard;
      },
      createCard: () =>
        set((state) => {
          state.activeCard = defaultImage;
          state.imageCards.push(state.activeCard);
        }),
      deleteCard: (index) =>
        set((state) => {
          state.imageCards.splice(index, 1);
          state.activeCard = null;
        }),
      setBackgroundUrl: (backgroundUrl) =>
        setToActive((state) => {
          state.activeCard.backgroundUrl = backgroundUrl;
        }),
      setBackgroundColor: (backgroundColor) =>
        setToActive((state) => {
          state.activeCard.backgroundColor = backgroundColor;
        }),
      setMainText: (mainText) =>
        setToActive((state) => {
          state.activeCard.mainText = mainText;
        }),
      setSecondText: (secondText) =>
        setToActive((state) => {
          state.activeCard.secondText = secondText;
        }),
      setMainTextContent: (content) =>
        setToActive((state) => {
          if (state.activeCard?.mainText) {
            state.activeCard.mainText.content = content;
          } else {
            state.activeCard.mainText = {
              ...defaultMainText,
              content,
            };
          }
        }),
      setSecondTextContent: (content) =>
        setToActive((state) => {
          if (state.activeCard?.secondText) {
            state.activeCard.secondText.content = content;
          } else {
            state.activeCard.secondText = {
              ...defaultSecondText,
              content,
            };
          }
        }),
      setMainTextColor: (color) =>
        setToActive((state) => {
          if (state.activeCard?.mainText) {
            state.activeCard.mainText.color = color;
          } else {
            state.activeCard.mainText = {
              ...defaultMainText,
              color,
            };
          }
        }),
      setSecondTextColor: (color) =>
        setToActive((state) => {
          if (state.activeCard?.secondText) {
            state.activeCard.secondText.color = color;
          } else {
            state.activeCard.secondText = {
              ...defaultSecondText,
              color,
            };
          }
        }),
      setMainTextFont: (font) =>
        setToActive((state) => {
          if (state.activeCard?.mainText) {
            state.activeCard.mainText.font = font;
          } else {
            state.activeCard.mainText = {
              ...defaultMainText,
              font,
            };
          }
        }),
      setSecondTextFont: (font) =>
        setToActive((state) => {
          if (state.activeCard?.secondText) {
            state.activeCard.secondText.font = font;
          } else {
            state.activeCard.secondText = {
              ...defaultMainText,
              font,
            };
          }
        }),
    };
  })
);
