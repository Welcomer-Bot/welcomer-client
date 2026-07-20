"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { useContext } from "react";
import { useStore } from "zustand";
import { EmbedTextInput } from "../embed-text-input";

export function EmbedFooterNameInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);
  const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <EmbedTextInput
      label="Footer text"
      ariaLabel="Text"
      errorSubject="Footer"
      maxLength={2048}
      value={embed?.footer?.text ?? ""}
      onValueChange={(value) =>
        editEmbed(embedIndex, {
          ...embed!,
          footer: {
            ...embed?.footer,
            text: value || "",
            icon_url: embed?.footer?.icon_url || "", // Ensure 'icon_url' is always defined
          },
        })
      }
      placeholder="Footer text"
      className="w-full"
    />
  );
}
