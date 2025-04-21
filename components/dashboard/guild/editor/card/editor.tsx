"use client";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { useStore } from "zustand";

export function CardPositionEditor() {
  const router = useRouter();
  const path = usePathname();
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const activeCardId = useStore(store, (state) => state.activeCardId);
  const activeCardToEmbedId = useStore(
    store,
    (state) => state.activeCardToEmbedId
  );
  const embeds = useStore(store, (state) => state.embeds);
  const setActiveCardEmbedPosition = useStore(
    store,
    (state) => state.setActiveCardEmbedPosition
  );

  return activeCardId === null ? (
    <div className="text-center w-full">
      <p>You dont have active card to show, select active card first</p>
      <Button
        className="mt-4"
        color="primary"
        onPress={() => router.push(path + "/image")}
      >
        Select Active Card
      </Button>
    </div>
  ) : (
    <div>
      <Button color="primary" onPress={() => router.push(path + "/image")}>
        Select Active Card
      </Button>
      <RadioGroup
        label="Card Position"
        value={
          activeCardToEmbedId?.toString() ||
          (activeCardToEmbedId == null && activeCardId ? "-1" : null)
        }
        onValueChange={(value) => {
          setActiveCardEmbedPosition(Number(value));
        }}
      >
        {embeds.map((embed, index) => (
          <Radio key={index} value={index.toString()}>
            {`Embed ${index + 1}`}
          </Radio>
        ))}
        <Radio value={"-1"}>Outside the embeds</Radio>
        <Radio value={"-2"}>Do not show card</Radio>
      </RadioGroup>
    </div>
  );
}
