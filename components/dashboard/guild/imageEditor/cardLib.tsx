"use client";

import { useImageStore } from "@/state/image";
import { Divider } from "@nextui-org/divider";
import { ClearCardsButton } from "./clearCardsButton";
import { CreateCardButton } from "./createCardButton";
import { ImageCard } from "./imageCard";
import { CardHeader } from "@nextui-org/card";


export function CardLib() {
  const cards = useImageStore((state) => state.imageCards);
  const activeCard = useImageStore((state) => state.activeCard);

  return (
    <>
      <CardHeader>
        <h1>Card Library ({cards.length}/5)</h1>
      </CardHeader>
      <Divider className="mt-1" />
      {cards.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 px-2 py-4 bg-dark-3 rounded-lg">
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
      <div className="space-x-4">
        <CreateCardButton />
        <ClearCardsButton />
      </div>
    </>
  );
}
