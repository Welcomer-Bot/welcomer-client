"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";

import { CompleteSource } from "@/prisma/schema";
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
}: SourceStoreProviderProps & { initialState?: CompleteSource }) => {
  const storeRef = useRef<SourceStoreAPI | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createSourceStore(initialState);
  }

  useEffect(() => {
    if (storeRef.current && initialState) {
      storeRef.current.setState((prevState) => ({
        ...prevState,
        ...initialState,
      }));
    }
  }, [initialState]);

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
