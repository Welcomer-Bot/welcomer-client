"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { useContext } from "react";
import { useStore } from "zustand";
import { EmbedTextInput } from "../embed-text-input";

export function EmbedBodyTitleInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);
  const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <EmbedTextInput
      label="Title"
      maxLength={256}
      value={embed?.title ?? ""}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed,
          title: value,
        })
      }
      placeholder="Title"
    />
  );
}
