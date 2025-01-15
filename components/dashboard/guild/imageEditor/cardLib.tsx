"use client";

import { useImageStore } from "@/state/image";
import { CreateCardButton } from "./createCardButton";
import { ImageCard } from "./imageCard";

export function CardLib() {
  const cards = useImageStore((state) => state.imageCards);
  const activeCard = useImageStore((state) => state.activeCard);

  return (
    <>
      {cards.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 p-4 bg-dark-3 rounded-lg">
          {cards.map((card, index) => (
            <ImageCard
              index={index}
              key={index}
              active={activeCard === index}
            />
          ))}
        </div>
      ) : (
        <div className="text-white">No cards found</div>
      )}
      <CreateCardButton />
    </>
  );
}
