"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedFooterNameInput({ embedIndex }: { embedIndex: number }) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);
  const editEmbed = useStore(store, (state) => state.editEmbed);

  return (
    <Input
      type="text"
      label={`Footer text ( ${embed?.footer?.text?.length ?? 0}/2048 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 2048)
          return "Footer must not exceed 2048 characters!";
      }}
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
