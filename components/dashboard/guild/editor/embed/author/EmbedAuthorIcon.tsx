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
  const embed = useStore(store, (state) => state.modified.message?.embeds?.[embedIndex] ?? state.message?.embeds?.[embedIndex]);
  const icon = useStore(store, (state) => state.modified.message?.embeds?.[embedIndex]?.author?.icon_url ?? state.message?.embeds?.[embedIndex]?.author?.icon_url);
  const editEmbeb = useStore(store, (state) => state.editEmbed);

  return (
    <Input
      type="url"
      isClearable
      label="Icon url"
      aria-label="Icon url"
      value={icon ?? ""}
      onValueChange={(value) => editEmbeb(embedIndex, {
        ...embed,
        author: {
          ...embed?.author,
          icon_url: value || undefined,
          name: embed?.author?.name || "", // Ensure 'name' is always defined
        },
      })}
      placeholder="https://example.com/icon.png"
      className="w-full"
      validate={(value) => {
        if (value && !/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|svg)$/.test(value)) {
          return "Icon URL must be a valid image URL!";
        }
      }
        
      }
    />
  );
}
