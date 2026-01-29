"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedFooterNameInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const footer = useStore(
    store,
    (state) => state.embeds[embedIndex].footer?.text
  );
  const setFooter = useStore(store, (state) => state.setEmbedFooterText);
  return (
    <Input
      type="text"
      label={`Footer text ( ${footer?.length ?? 0}/2048 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 2048)
          return "Footer must not exceed 2048 characters!";
      }}
      value={footer ?? ""}
      onValueChange={(value) => setFooter(embedIndex, value)}
    />
  );
}
