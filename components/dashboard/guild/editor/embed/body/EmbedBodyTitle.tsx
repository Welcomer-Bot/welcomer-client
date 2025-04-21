"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedBodyTitleInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embedTitle = useStore(store, (state) => state.embeds[embedIndex].title);
  const setEmbedTitle = useStore(store, (state) => state.setEmbedTitle);
  return (
    <Input
      label={"Title " + `( ${embedTitle?.length ?? 0}/256 )`}
      validate={(value) => {
        if (value.length > 256) return "Title must not exceed 256 characters!";
      }}
      value={embedTitle ?? ""}
      onValueChange={(value) => setEmbedTitle(embedIndex, value)}
    />
  );
}
