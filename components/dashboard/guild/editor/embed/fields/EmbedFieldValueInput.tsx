"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedFieldValueInput({
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
  

  const fieldValue = embed?.fields?.[fieldIndex]?.value;
 
  return (
    <Input
      type="text"
      label={`Footer text ( ${fieldValue?.length ?? 0}/1024 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 1024)
          return "Footer must not exceed 1024 characters!";
      }}
      value={fieldValue ?? ""}
      onValueChange={(value) => editField(embedIndex, fieldIndex, { value })}
      placeholder="Field Value"
    />
  );
}
