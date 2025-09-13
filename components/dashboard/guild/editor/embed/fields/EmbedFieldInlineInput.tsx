"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Checkbox } from "@heroui/checkbox";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedFieldInlineInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
      const embed = useStore(
        store,
        (state) =>
          state.modified.message?.embeds?.[embedIndex] ??
          state.message?.embeds?.[embedIndex]
      );
  const editField = useStore(store, (state) => state.editField);
  
  const fieldInline = embed?.fields?.[fieldIndex]?.inline;

  return (
    <Checkbox
      isSelected={fieldInline ?? false}
      onValueChange={(value) => editField(embedIndex, fieldIndex, { inline: value })}
    >
      Inline
    </Checkbox>
  );
}
