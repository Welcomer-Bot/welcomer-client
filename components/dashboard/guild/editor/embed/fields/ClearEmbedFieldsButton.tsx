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
  const fieldsLength = useStore(
    store,
    (state) => state.embeds[embedIndex].fields.length
  );
  const clearFields = useStore(store, (state) => state.clearFields);

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
