"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedBodyColorInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);
  const editEmbed = useStore(store, (state) => state.editEmbed);

  const embedColor = embed?.color
    ? `#${embed.color.toString(16).padStart(6, "0")}`
    : null;

  return (
    <Input
      type="color"
      value={embedColor ?? undefined}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed,
          color: value ? parseInt(value.replace("#", ""), 16) : undefined,
        })
      }
      label="Embed color"
      aria-label="Embed color"
      isClearable
    />
  );
}
