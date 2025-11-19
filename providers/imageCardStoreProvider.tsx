"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
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
  const store = useMemo(() => createImageCardStore(initialState), [initialState]);

  return (
    <ImageCardStoreContext.Provider value={store}>
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
