"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Textarea } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedBodyDescriptionInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const description = useStore(
    store,
    (state) => state.embeds[embedIndex].description
  );
  const setDescription = useStore(store, (state) => state.setEmbedDescription);
  return (
    <Textarea
      label="Description"
      value={description ?? ""}
      onValueChange={(value) => setDescription(embedIndex, value)}
    />
  );
}
