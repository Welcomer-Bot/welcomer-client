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
  const fieldInline = useStore(
    store,
    (state) => state.embeds[embedIndex].fields[fieldIndex].inline
  );
  const setFieldInline = useStore(store, (state) => state.setFieldInline);

  return (
    <Checkbox
      isSelected={fieldInline ?? false}
      onValueChange={(value) => setFieldInline(embedIndex, fieldIndex, value)}
    >
      Inline
    </Checkbox>
  );
}
