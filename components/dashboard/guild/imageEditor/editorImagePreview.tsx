"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { lazy, Suspense, useContext } from "react";
import { useStore } from "zustand";

const LazyImagePreview = lazy(() => import("./imagePreview"));

export function EditorImagePreview() {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const previewImage = useStore(
    store,
    (state) => state.getActiveCard()?.imagePreview
  );

  if (!previewImage) return <>No image to load</>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyImagePreview img={previewImage} />
    </Suspense>
  );
}
