import { getUser } from "@/lib/dal";
import { ImageCard, ImageCardText } from "@/lib/discord/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// export interface ImageCard {
//   backgroundUrl: string;
//   backgroundColor: string;
//   mainText: ImageCardText;
//   secondText: ImageCardText;
//   nicknameText: ImageCardText;
// }

export interface ImageParams extends ImageCard {
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
}


const defaultImage: ImageCard = {
  backgroundUrl: "",
  backgroundColor: "#000000",
  mainText: defaultMainText,
  secondText: defaultSecondText,
  nicknameText: nicknameText,
  
};

export const useImageStore = create<ImageParams>()(
  immer((set) => ({
    ...defaultImage,
    setBackgroundUrl: (backgroundUrl) => set({ backgroundUrl }),
    setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
    setMainTextContent: (content) =>
      set((state) => {
        if (state.mainText) {
          state.mainText.content = content;
        }
      }),
    setSecondTextContent: (content) =>
      set((state) => {
        if (state.secondText) {
          state.secondText.content = content;
        }
      }),
    setMainTextColor: (color) =>
      set((state) => {
        if (state.mainText) {
          state.mainText.color = color;
        }
      }),
    setSecondTextColor: (color) =>
      set((state) => {
        if (state.secondText) {
          state.secondText.color = color;
        }
      }),
    setMainTextFont: (font) =>
      set((state) => {
        if (state.mainText) {
          state.mainText.font = font;
        }
      }),
    setSecondTextFont: (font) =>
      set((state) => {
        if (state.secondText) {
          state.secondText.font = font;
        }
      }),
    setMainText: (mainText) => set({ mainText }),
    setSecondText: (secondText) => set({ secondText }),
  }))
);
