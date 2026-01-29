"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { ImageTextType } from "@/types";
import { Input } from "@heroui/input";
import { Color } from "@welcomer-bot/card-canvas";
import { useContext } from "react";
import { useStore } from "zustand";

export function ImageColorInput({ textType }: { textType: ImageTextType }) {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const color = useStore(
    store,
    (state) => state.getActiveCard()![textType]?.color
  );
  const setColor = useStore(store, (state) => state.setTextColor);

  return (
    <Input
      type="color"
      aria-label="Color"
      value={color ?? ""}
      onValueChange={(value) => setColor(textType, value as Color)}
    />
  );
}
