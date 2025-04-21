"use client";

import { Input } from "@heroui/input";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedAuthorUrlInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
    const store = useContext(SourceStoreContext);
     if (!store) throw new Error("Missing SourceStore.Provider in the tree");
    const url = useStore(store, (state) => state.embeds[embedIndex].author?.url);
    const setUrl = useStore(store, (state) => state.setEmbedAuthorUrl);

  return (
    <Input
      type="url"
      isClearable
      aria-label="Author url"
      label="Author url"
      value={url ?? ""}
      onValueChange={(value) => setUrl(embedIndex, value)}
    />
  );
}
