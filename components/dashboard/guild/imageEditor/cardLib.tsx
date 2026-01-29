"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useContext } from "react";
import { useStore } from "zustand";
import { ClearCardsButton } from "./clearCardsButton";
import { CreateCardButton } from "./createCardButton";
import { ImageCard } from "./imageCard";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";

export function CardLib() {
  const store = useContext(ImageStoreContext);
  const sourceStore = useContext(SourceStoreContext);
  if (!sourceStore) throw new Error("Missing SourceStore.Provider in the tree");
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const guildId = useStore(sourceStore, (state) => state.guildId);
  const cards = useStore(store, (state) => state.imageCards);
  const activeCard = useStore(store, (state) => state.selectedCard);

  return (
    <>
      <CardHeader>
        <h1>Card Library ({cards.length}/5)</h1>
      </CardHeader>
      <Divider className="mt-1" />
      {cards.length > 0 ? (
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 px-2 py-4 bg-dark-3 rounded-lg">
          {cards.map((card, index) => (
            <ImageCard
              index={index}
              key={index}
              active={activeCard === index}
              guildId={guildId || ""}
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
