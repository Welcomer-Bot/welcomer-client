"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyImagePreview = lazy(() => import("./imagePreview"));

export function EditorImagePreview() {
  const [img, setImg] = useState<string>();
  const activeCard = useImageStore((state) => state.getActiveCard());
  const guildId = useImageStore((state) => state.moduleId);
  const [debounceImage, setDebounceImage] = useState(activeCard);
  const setPreviewImage = useImageStore((state) => state.setPreviewImage);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceImage(activeCard);
    }, 500);
    return () => clearTimeout(timeout);
  }, [activeCard]);

  useEffect(() => {
    console.log("Image preview", debounceImage);
    const fetchImage = async () => {
      if (!activeCard) return;
      if (!guildId) return;
      const previewImage = await generateImage(activeCard, guildId);
      setPreviewImage(previewImage);
      setImg(previewImage);
    };
    fetchImage();
  }, [activeCard, debounceImage, guildId, setPreviewImage]);
  if (!img) return <>No image to load</>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyImagePreview img={img} />
    </Suspense>
  );
}
