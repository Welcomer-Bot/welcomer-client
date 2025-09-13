"use client";

import { Button } from "@heroui/react";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { useContext } from "react";
import { useStore } from "zustand";

export default function ClearEmbedFieldsButton({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

    const embed = useStore(
      store,
      (state) =>
        state.modified.message?.embeds?.[embedIndex] ??
        state.message?.embeds?.[embedIndex]
    );
    const clearFields = useStore(store, (state) => state.clearFields);

  const fieldsLength = embed?.fields?.length ?? 0;

  return (
    <Button
      color="danger"
      isDisabled={fieldsLength == 0}
      variant="ghost"
      onPress={() => clearFields(embedIndex)}
    >
      Clear Embeds
    </Button>
  );
}
