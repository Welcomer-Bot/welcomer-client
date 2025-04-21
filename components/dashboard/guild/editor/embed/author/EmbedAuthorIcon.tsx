"use client";

import { Input } from "@heroui/input";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedAuthorIconInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const store = useContext(SourceStoreContext);
   if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const icon = useStore(store, (state) => state.embeds[embedIndex].author?.iconUrl);
  const setIcon = useStore(store, (state) => state.setEmbedAuthorIcon);

  return (
    <Input
      type="url"
      isClearable
      label="Icon url"
      aria-label="Icon url"
      value={icon ?? ""}
      onValueChange={(value) => setIcon(embedIndex, value)}
    />
  );
}
