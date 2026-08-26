"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
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
    // Zustand docs, "Initialize state with props" → wrapping the context
    // provider: the store is created exactly once per mount. `initialState` is
    // deliberately not a dependency — a fresh server payload must not discard
    // the user's unsaved edits. To rebind the provider to a different entity,
    // pass a `key` at the call site so React remounts it on purpose.
    const [store] = useState(() => createStoreFn(initialState));
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
