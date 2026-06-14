"use client";

import {
  createSourceStore,
  type SourceStore,
} from "@/features/dashboard/modules/stores/source-store";
import { Source } from "@/generated/prisma/browser";
import { createStoreProvider } from "./create-store-provider";

const {
  Context: SourceStoreContext,
  Provider: SourceStoreProvider,
  useBoundStore: useSourceStore,
} = createStoreProvider<Source, SourceStore>(createSourceStore, "SourceStore");

export { SourceStoreContext, SourceStoreProvider, useSourceStore };
