"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/react";
import { useContext } from "react";
import { useStore } from "zustand";

export default function AddEmbedFieldsButton({
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
  const addField = useStore(store, (state) => state.addField);
  const fieldsLength = embed?.fields?.length ?? 0;

  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={fieldsLength >= 25}
      onPress={() => fieldsLength < 25 && addField(embedIndex)}
    >
      Add Field
    </Button>
  );
}
