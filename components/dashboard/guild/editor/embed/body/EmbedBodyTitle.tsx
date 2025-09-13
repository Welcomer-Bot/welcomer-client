"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedBodyTitleInput({ embedIndex }: { embedIndex: number }) {
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
      label={"Title " + `( ${embed?.title?.length ?? 0}/256 )`}
      validate={(value) => {
        if (value.length > 256) return "Title must not exceed 256 characters!";
      }}
      value={embed?.title ?? ""}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed,
          title: value,
        })
      }
      aria-label="Title"
      placeholder="Title"
      type="text"
    />
  );
}
