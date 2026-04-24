"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";

export function createStoreProvider<TState, TStore>(
  createStoreFn: (initState?: Partial<TState>) => StoreApi<TStore>,
  name: string,
) {
  const Context = createContext<StoreApi<TStore> | undefined>(undefined);

  const Provider = ({
    children,
    initialState,
  }: {
    children: ReactNode;
    initialState?: Partial<TState>;
  }) => {
    const store = useMemo(
      () => createStoreFn(initialState),
      [initialState],
    );
    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useBoundStore = <T,>(selector: (store: TStore) => T): T => {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return useStore(ctx, selector);
  };

  return { Context, Provider, useBoundStore };
}
