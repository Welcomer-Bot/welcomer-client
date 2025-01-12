"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import debounce from "debounce";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyImagePreview = lazy(() => import("./imagePreview"));


export function EditorImagePreview() {
  const [img, setImg] = useState<string>();
  const store = useImageStore();
  useEffect(() => {
    const fetchImage = async () => {
      const image = await generateImage(store);
      setImg(image);
    };
    fetchImage();
  }, [store]);
  if (!img) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <LazyImagePreview img={img} />
    </Suspense>
  );
}