"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function EmbedFieldNameInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const fieldName = useStore(
    store,
    (state) => state.embeds[embedIndex].fields[fieldIndex].name
  );
  const setFieldName = useStore(store, (state) => state.setFieldName);

  return (
    <Input
      type="text"
      label={`Footer text ( ${fieldName?.length ?? 0}/256 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 256) return "Footer must not exceed 256 characters!";
      }}
      value={fieldName ?? ""}
      onValueChange={(value) => setFieldName(embedIndex, fieldIndex, value)}
    />
  );
}
