"use client";

import {
  createImageCardStore,
  type ImageCardState,
  type ImageCardStore,
} from "@/features/dashboard/modules/stores/image-card-store";
import { createStoreProvider } from "./create-store-provider";

const {
  Context: ImageCardStoreContext,
  Provider: ImageCardStoreProvider,
  useBoundStore: useImageCardStore,
} = createStoreProvider<ImageCardState, ImageCardStore>(
  createImageCardStore,
  "ImageCardStore",
);

export {
  ImageCardStoreContext,
  ImageCardStoreProvider,
  useImageCardStore,
};
