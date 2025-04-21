"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import { createImageStore, type ImageStore, type ImageState } from "@/state/image";
export type ImageStoreAPI = ReturnType<typeof createImageStore>;

export const ImageStoreContext = createContext<ImageStoreAPI | undefined>(
  undefined
);

export interface ImageStoreProviderProps {
  children: ReactNode;
}

export const ImageStoreProvider = ({
  children,
  initialState,
}: ImageStoreProviderProps & {
  initialState?: Partial<ImageState>;
}) => {
  const storeRef = useRef<ImageStoreAPI | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createImageStore(initialState);
  }
  storeRef.current.setState((state) => ({
    ...state,
    ...initialState,
    edited: false,
  }));

  return (
    <ImageStoreContext.Provider value={storeRef.current}>
      {children}
    </ImageStoreContext.Provider>
  );
};

export const useImageStore = <T,>(selector: (store: ImageStore) => T): T => {
  const imageStoreContext = useContext(ImageStoreContext);

  if (!imageStoreContext) {
    throw new Error(`useImageStore must be used within ImageStoreProvider`);
  }

  return useStore(imageStoreContext, selector);
};
