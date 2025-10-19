"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";

import { Source } from "@/prisma/generated/client";
import { createSourceStore, type SourceStore } from "@/state/source";
export type SourceStoreAPI = ReturnType<typeof createSourceStore>;

export const SourceStoreContext = createContext<SourceStoreAPI | undefined>(
  undefined
);

export interface SourceStoreProviderProps {
  children: ReactNode;
}

export const SourceStoreProvider = ({
  children,
  initialState,
}: SourceStoreProviderProps & { initialState?: Partial<Source> }) => {
  const storeRef = useRef<SourceStoreAPI | null>(null);
  storeRef.current = createSourceStore(initialState);

  return (
    <SourceStoreContext.Provider value={storeRef.current}>
      {children}
    </SourceStoreContext.Provider>
  );
};

export const useSourceStore = <T,>(selector: (store: SourceStore) => T): T => {
  const sourceStoreContext = useContext(SourceStoreContext);

  if (!sourceStoreContext) {
    throw new Error(`useSourceStore must be used within SourceStoreProvider`);
  }

  return useStore(sourceStoreContext, selector);
};
