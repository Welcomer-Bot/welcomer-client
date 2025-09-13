"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedAuthorNameInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embed = useStore(
    store,
    (state) =>
      state.modified.message?.embeds?.[embedIndex] ??
      state.message?.embeds?.[embedIndex]
  );

  const author = embed?.author?.name;
  const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <Input
      type="text"
      label={`Name ( ${author?.length ?? 0}/256 )`}
      aria-label="Author"
      validate={(value) => {
        if (value.length > 256) return "Author must not exceed 256 characters!";
      }}
      value={author ?? ""}
      onValueChange={(value) => editEmbed(embedIndex, {
        ...embed,
        author: {...embed?.author, name: value},
      })}
    />
  );
}
