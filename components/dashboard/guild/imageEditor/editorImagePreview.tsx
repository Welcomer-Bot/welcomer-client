"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyImagePreview = lazy(() => import("./imagePreview"));

export function EditorImagePreview() {
  const [img, setImg] = useState<string>();
  const activeCard = useImageStore((state) => state.getActiveCard());
  const [debounceImage, setDebounceImage] = useState(activeCard);
  const setPreviewImage = useImageStore((state) => state.setPreviewImage);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceImage(activeCard);
    }, 500);
    return () => clearTimeout(timeout);
  }, [activeCard]);

  useEffect(() => {
    // console.log("updating image", activeCard);
    const fetchImage = async () => {
      if (!activeCard) return;
      const previewImage = await generateImage(activeCard);
      setPreviewImage(previewImage);
      setImg(previewImage);
    };
    fetchImage();
  }, [debounceImage]);
  if (!img) return <>No image to load</>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyImagePreview img={img} />
    </Suspense>
  );
}
