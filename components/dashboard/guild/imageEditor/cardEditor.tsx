"use client";

import { useImageStore } from "@/state/image";
import { ImageTextFields } from "./text/ImageTextFields";

export function CardEditor() {
    const currentCard = useImageStore((state) => state.activeCard);
    
    if (!currentCard) return (
        <div className="text-white">No card selected</div>
    );

  return (
    <form className="px-5 pt-5 pb-20 space-y-5 w-full relative">
      <ImageTextFields textType="mainText" />
      <ImageTextFields textType="secondText" />
    </form>
  );
}