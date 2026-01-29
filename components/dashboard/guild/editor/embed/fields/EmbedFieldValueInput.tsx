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
  const fieldValue = useStore(
    store,
    (state) => state.embeds[embedIndex].fields[fieldIndex].value
  );
  const setFieldValue = useStore(store, (state) => state.setFieldValue);

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
      onValueChange={(value) => setFieldValue(embedIndex, fieldIndex, value)}
    />
  );
}
