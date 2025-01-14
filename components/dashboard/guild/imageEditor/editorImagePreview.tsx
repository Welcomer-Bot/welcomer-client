"use client";

import { generateImage } from "@/lib/discord/image";
import { useImageStore } from "@/state/image";
import debounce from "debounce";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyImagePreview = lazy(() => import("./imagePreview"));


export function EditorImagePreview() {
  const [img, setImg] = useState<string>();
  const activeImage = useImageStore((state) => state.activeCard);
  useEffect(() => {
    const fetchImage = async () => {
      if(!activeImage) return;
      const image = await generateImage(activeImage);
      setImg(image);
    };
    fetchImage();
    setInterval(() => {
      fetchImage();
    }, 1000);
  }, []);
  if (!img) return (<>No image to load</>);
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <LazyImagePreview img={img} />
    </Suspense>
  );
}