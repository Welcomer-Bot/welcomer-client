import { BaseCardParams, TextCard } from "@/lib/discord/schema";
import { ImageTextType } from "@/types";
import { Color } from "@welcomer-bot/card-canvas";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ImageState = {
  imageCards: (BaseCardParams & { imagePreview?: string })[];
  removedCard: BaseCardParams[];
  removedText: TextCard[];
  edited: boolean;
  sourceId: number | null;
  selectedCard: number | null;
  initialState?: Partial<ImageState>;
};

export type ImageActions = {
  setCards: (cards: BaseCardParams[]) => void;
  setActiveCard: (index: number) => void;
  setActiveCardId: (id: number) => void;
  getActiveCard: () => (BaseCardParams & { imagePreview?: string }) | null;
  setPreviewImage: (image: string) => void;
  createCard: () => void;
  clearCards: () => void;
  deleteCard: (index: number) => void;
  setBackgroundUrl: (backgroundUrl?: string | null) => void;
  setBackgroundColor: (backgroundColor: Color) => void;
  setMainText: (mainText: TextCard) => void;
  setSecondText: (secondText: TextCard) => void;
  setTextContent: (textType: ImageTextType, content: string) => void;
  setTextColor: (textType: ImageTextType, color: Color) => void;
  setTextFont: (textType: ImageTextType, font: string) => void;
  removeText: (textType: ImageTextType) => void;
  addText: (textType: ImageTextType) => void;
  reset: () => void;
};
export type ImageStore = ImageState & ImageActions;

const defaultMainText: TextCard = {
  content: "Welcome {username} to the server!",
  color: "#ffffff",
  font: "Arial",
};

const defaultSecondText: TextCard = {
  content: "You are the {membercount} member!",
  color: "#ffffff",
  font: "Arial",
};

const defaultNicknameText: TextCard = {
  content: "{username}",
  color: "#ffffff",
  font: "Arial",
};

const defaultImage: BaseCardParams & { imagePreview?: string } = {
  mainText: defaultMainText,
  secondText: defaultSecondText,
  nicknameText: defaultNicknameText,
  backgroundImgURL: "",
};

export const createImageStore = (
  initState: Partial<ImageState> = {
    imageCards: [],
    removedCard: [],
    removedText: [],
    edited: false,
    sourceId: null,
    selectedCard: null,
  }
) => {
  return createStore<ImageStore>()(
    immer((set, get) => {
      const setToActive = (
        fn: (
          state: ImageStore & { activeCard: number; selectedCard: number }
        ) => void,
        edited: boolean = true
      ) => {
        set((state) => {
          if (
            state.selectedCard === null ||
            state.imageCards[state.selectedCard] === undefined
          )
            return;
          if (edited) {
            state.edited = true;
          }
          fn(
            state as ImageStore & { activeCard: number; selectedCard: number }
          );
        });
      };

      return {
        initialState: initState,
        removedCard: [],
        removedText: [],
        edited: false,
        sourceId: null,
        selectedCard: null,
        imageCards: [],
        ...initState,
        setActiveCard: (index) =>
          set((state) => {

            if (state.imageCards[index] === undefined) {
              return;
            }
            if (state.selectedCard === index) {
              state.selectedCard = null;
            } else {
              state.selectedCard = index;
            }
            state.edited = true;
          }),
        setActiveCardId: (id) =>
          set((state) => {
            state.selectedCard = state.imageCards.findIndex(
              (card) => card.id === id
            );
          }),

        setCards: (cards) =>
          set((state) => {
            state.imageCards = cards;
          }),
        getActiveCard: () => {
          const state = get();
          if (state.selectedCard === null) {
            return null;
          }
          return state.imageCards[state.selectedCard];
        },
        setPreviewImage: (image) =>
          setToActive((state) => {
            if (state.imageCards[state.selectedCard]) {
              state.imageCards[state.selectedCard].imagePreview = image;
            }
          }, false),

        createCard: () =>
          set((state) => {
            const index = state.imageCards.push(defaultImage);
            state.selectedCard = index - 1;
            state.edited = true;
          }),
        clearCards: () =>
          set((state) => {
            state.removedCard.push(...state.imageCards);
            state.imageCards = [];
            state.selectedCard = null;
            state.edited = true;
          }),
        deleteCard: (index) =>
          set((state) => {
            state.removedCard.push(state.imageCards[index]);
            state.imageCards.splice(index, 1);
            if (state.selectedCard === index) {
              state.selectedCard = null;
            } else if (state.selectedCard !== null) {
              state.selectedCard =
                state.selectedCard > index
                  ? state.selectedCard - 1
                  : state.selectedCard;
            }
            if (state.imageCards.length === 0) {
              state.selectedCard = null;
            }
            state.edited = true;
          }),
        setBackgroundUrl: (backgroundUrl) =>
          setToActive((state) => {
            state.imageCards[state.selectedCard].backgroundImgURL =
              backgroundUrl;
          }),
        setBackgroundColor: (backgroundColor) =>
          setToActive((state) => {
            if (state.imageCards[state.selectedCard]) {
              state.imageCards[state.selectedCard].backgroundColor =
                backgroundColor;
            }
          }),
        setMainText: (mainText) =>
          setToActive((state) => {
            state.imageCards[state.selectedCard].mainText = mainText;
          }),
        setSecondText: (secondText) =>
          setToActive((state) => {
            state.imageCards[state.selectedCard].secondText = secondText;
          }),
        setTextContent: (textType, content) =>
          setToActive((state) => {
            if (state.imageCards[state.selectedCard][textType]) {
              state.imageCards[state.selectedCard][textType]!.content = content;
            } else {
              state.imageCards[state.selectedCard][textType] = {
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
            if (state.imageCards[state.selectedCard][textType]) {
              state.imageCards[state.selectedCard][textType]!.color = color;
            } else {
              state.imageCards[state.selectedCard][textType] = {
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
            if (state.imageCards[state.selectedCard][textType]) {
              state.imageCards[state.selectedCard][textType]!.font = font;
            } else {
              state.imageCards[state.selectedCard][textType] = {
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
            const text = state.imageCards[state.selectedCard][textType];
            if (text) {
              state.removedText.push(text);
            }
            state.imageCards[state.selectedCard][textType] = null;
          }),
        addText: (textType) =>
          setToActive((state) => {
            state.imageCards[state.selectedCard][textType] =
              textType === "mainText"
                ? defaultMainText
                : textType === "secondText"
                  ? defaultSecondText
                  : defaultNicknameText;
          }),
        reset: () =>
          set((state) => ({ 
            removedCard: [],
            removedText: [],
            edited: false,
            sourceId: null,
            selectedCard: null,
            imageCards: [],
            ...state.initialState,
          }))

      };
    })
  );
};

export const extractImageState = (data: ImageStore): ImageState => {
  return {
    imageCards: data.imageCards.map((card) => {
      return { ...card, imagePreview: undefined };
    }),
    removedCard: data.removedCard.map((card) => {
      return { ...card, imagePreview: undefined };
    }),
    removedText: data.removedText,
    edited: data.edited,
    sourceId: data.sourceId,
    selectedCard: data.selectedCard,
  };
};
