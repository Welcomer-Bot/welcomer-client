"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import {
  createImageCardStore,
  type ImageCardState,
  type ImageCardStore,
} from "@/state/imageCard";

export type ImageCardStoreAPI = ReturnType<typeof createImageCardStore>;

export const ImageCardStoreContext = createContext<
  ImageCardStoreAPI | undefined
>(undefined);

export interface ImageCardStoreProviderProps {
  children: ReactNode;
}

export const ImageCardStoreProvider = ({
  children,
  initialState,
}: ImageCardStoreProviderProps & {
  initialState?: Partial<ImageCardState>;
}) => {
  const storeRef = useRef<ImageCardStoreAPI | null>(null);
  storeRef.current = createImageCardStore(initialState);

  return (
    <ImageCardStoreContext.Provider value={storeRef.current}>
      {children}
    </ImageCardStoreContext.Provider>
  );
};

export const useImageCardStore = <T,>(
  selector: (store: ImageCardStore) => T
): T => {
  const imageCardStoreContext = useContext(ImageCardStoreContext);

  if (!imageCardStoreContext) {
    throw new Error(
      `useImageCardStore must be used within ImageCardStoreProvider`
    );
  }

  return useStore(imageCardStoreContext, selector);
};
