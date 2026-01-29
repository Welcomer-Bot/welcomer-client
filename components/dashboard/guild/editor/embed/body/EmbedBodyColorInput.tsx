"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedBodyColorInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
      const store = useContext(SourceStoreContext);
       if (!store) throw new Error("Missing SourceStore.Provider in the tree");
      const embedColor = useStore(store, (state) => state.embeds[embedIndex]?.color);
      const setEmbedColor = useStore(store, (state) => state.setEmbedColor);

  return (
    <Input
      type="color"
      value={embedColor ?? undefined}
      onValueChange={(value) => setEmbedColor(embedIndex, value)}
    />
  );
}
