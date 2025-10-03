"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { APIEmbedAuthor } from "discord.js";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedAuthorUrlInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);

  const url = embed?.author?.url;
  const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <Input
      type="url"
      isClearable
      aria-label="Author url"
      label="Author url"
      value={url ?? ""}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed,
          author: { ...(embed?.author as APIEmbedAuthor), url: value },
        })
      }
    />
  );
}
