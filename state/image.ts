import { parseText } from "@/lib/discord/text";
import { User, UserGuild } from "@prisma/client";
import { BaseCardParams, Color, TextCard } from "@welcomer-bot/card-canvas";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ImageStore {
  imageCards: (BaseCardParams & { imagePreview?: string })[];
  activeCard: number | null;
  setActiveCard: (index: number) => void;
  getActiveCard: () => BaseCardParams | null;
  setPreviewImage: (image: string) => void;
  createCard: () => void;
  deleteCard: (index: number) => void;
  setBackgroundUrl: (backgroundUrl: string) => void;
  setBackgroundColor: (backgroundColor: Color) => void;
  setMainText: (mainText: TextCard) => void;
  setSecondText: (secondText: TextCard) => void;
  setMainTextContent: (content: string) => void;
  setSecondTextContent: (content: string) => void;
  setMainTextColor: (color: Color) => void;
  setSecondTextColor: (color: Color) => void;
  setMainTextFont: (font: string) => void;
  setSecondTextFont: (font: string) => void;
  parseCardText: (user: User, guild: UserGuild) => string;
}

const defaultMainText: TextCard = {
  content: "Welcome {user} to the server!",
  color: "#ffffff",
};

const defaultSecondText: TextCard = {
  content: "You are the {memberCount} member!",
  color: "#ffffff",
};

const nicknameText: TextCard = {
  content: "{username}",
  color: "#ffffff",
};

const defaultImage: BaseCardParams & { imagePreview?: string } = {
  mainText: defaultMainText,
  secondText: defaultSecondText,
  nicknameText: nicknameText,
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
        fn(state as ImageStore & { activeCard: number });
      });
    };

    return {
      imageCards: [],
      activeCard: null,
      setActiveCard: (index) =>
        set((state) => {
          state.activeCard = index;
        }),

      getActiveCard: () => {
        const state = get();
        if (state.activeCard === null) {
          console.log("No active card, got null");
          return null
        };
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
          state.imageCards[state.activeCard].backgroundImgURL = backgroundUrl;
        }),
      setBackgroundColor: (backgroundColor) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard]) {
            if (state.imageCards[state.activeCard].backgroundColor) {
              state.imageCards[state.activeCard].backgroundColor = {
                background: backgroundColor,
              };
            } else {
              state.imageCards[state.activeCard].backgroundColor = {
                background: backgroundColor,
              };
            }
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
      setMainTextContent: (content) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard].mainText) {
            state.imageCards[state.activeCard].mainText!.content = content;
          } else {
            state.imageCards[state.activeCard].mainText = {
              ...defaultMainText,
              content,
            };
          }
        }),
      setSecondTextContent: (content) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard].secondText) {
            state.imageCards[state.activeCard].secondText!.content = content;
          } else {
            state.imageCards[state.activeCard].secondText = {
              ...defaultSecondText,
              content,
            };
          }
        }),
      setMainTextColor: (color) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard].mainText) {
            state.imageCards[state.activeCard].mainText!.color = color;
          } else {
            state.imageCards[state.activeCard].mainText = {
              ...defaultMainText,
              color,
            };
          }
        }),
      setSecondTextColor: (color) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard].secondText) {
            state.imageCards[state.activeCard].secondText!.color = color;
          } else {
            state.imageCards[state.activeCard].secondText = {
              ...defaultSecondText,
              color,
            };
          }
        }),
      setMainTextFont: (font) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard].mainText) {
            state.imageCards[state.activeCard].mainText!.font = font;
          } else {
            state.imageCards[state.activeCard].mainText = {
              ...defaultMainText,
              font,
            };
          }
        }),
      setSecondTextFont: (font) =>
        setToActive((state) => {
          if (state.imageCards[state.activeCard].secondText) {
            state.imageCards[state.activeCard].secondText!.font = font;
          } else {
            state.imageCards[state.activeCard].secondText = {
              ...defaultSecondText,
              font,
            };
          }
        }),
      parseCardText(user, guild) {
        const state = get();
        if (state.activeCard === null) {
          console.log("No active card, got null");
          return null;
        }
        const card = state.imageCards[state.activeCard];
        if (!card) return "";
        return {
          ...card,
          mainText: card.mainText ? parseText(card.mainText.content, user, guild) : null,
          secondText: card.secondText ? parseText(card.secondText.content, user, guild) : null,
        }
      },
    };
  })
);
