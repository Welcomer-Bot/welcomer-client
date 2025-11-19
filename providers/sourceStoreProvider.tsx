"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
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
  const store = useMemo(() => createSourceStore(initialState), [initialState]);

  return (
    <SourceStoreContext.Provider value={store}>
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
