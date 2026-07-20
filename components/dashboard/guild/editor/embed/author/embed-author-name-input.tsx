"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { useContext } from "react";
import { useStore } from "zustand";
import { EmbedTextInput } from "../embed-text-input";

export function EmbedAuthorNameInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);

  const author = embed?.author?.name;
  const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <EmbedTextInput
      label="Name"
      ariaLabel="Author"
      errorSubject="Author"
      maxLength={256}
      value={author ?? ""}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed,
          author: { ...embed?.author, name: value },
        })
      }
    />
  );
}
