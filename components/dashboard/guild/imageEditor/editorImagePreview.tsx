"use client";

import { useImageStore } from "@/state/image";
import { lazy, Suspense } from "react";

const LazyImagePreview = lazy(() => import("./imagePreview"));

export function EditorImagePreview() {
  const activeCard = useImageStore((state) => state.getActiveCard());
  const previewImage = activeCard?.imagePreview;

  if (!previewImage) return <>No image to load</>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyImagePreview img={previewImage} />
    </Suspense>
  );
}
