"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedFooterIconInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
     const embed = useStore(
       store,
       (state) =>
         state.modified.message?.embeds?.[embedIndex] ??
         state.message?.embeds?.[embedIndex]
     );
     const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <Input
      type="url"
      isClearable
      label="Icon url"
      aria-label="Icon url"
      value={embed?.footer?.icon_url ?? ""}
      onValueChange={(value) => editEmbed(embedIndex, {
        ...embed!,
        footer: {
          ...embed?.footer,
          icon_url: value || undefined,
          text: embed?.footer?.text || "", // Ensure 'text' is always defined
        },
      })}
      placeholder="https://example.com/icon.png"
      className="w-full"
    />
  );
}
