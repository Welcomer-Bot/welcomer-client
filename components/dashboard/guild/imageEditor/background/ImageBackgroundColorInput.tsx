"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { Input } from "@heroui/input";
import { Color } from "@welcomer-bot/card-canvas";
import { useContext } from "react";
import { useStore } from "zustand";

export function ImageBackgroundColorInput() {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const color = useStore(
    store,
    (state) => state.getActiveCard()?.backgroundColor
  );
  const setColor = useStore(store, (state) => state.setBackgroundColor);

  return (
    <Input
      type="color"
      aria-label="Color"
      value={color ?? ""}
      onValueChange={(value) => setColor(value as Color)}
    />
  );
}
