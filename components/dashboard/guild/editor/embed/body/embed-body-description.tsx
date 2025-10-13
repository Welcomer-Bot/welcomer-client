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
  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);
  const editEmbed = useStore(store, (state) => state.editEmbed);
  const description = embed?.description;
  return (
    <Textarea
      label="Description"
      value={description ?? ""}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed,
          description: value,
        })
      }
      validate={(value) => {
        if (value.length > 4096)
          return "Description must not exceed 4096 characters!";
      }}
      aria-label="Description"
      maxLength={4096}
      minRows={3}
      maxRows={10}
      placeholder="Description"
    />
  );
}
