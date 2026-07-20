"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { useContext } from "react";
import { useStore } from "zustand";
import { EmbedTextInput } from "../embed-text-input";

export function EmbedFieldNameInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

  const embed = useStore(store, (state) => state.message?.embeds?.[embedIndex]);
  const editField = useStore(store, (state) => state.editField);

  const fieldName = embed?.fields?.[fieldIndex]?.name;

  return (
    <EmbedTextInput
      label="Field name"
      ariaLabel={`Field name ${fieldIndex + 1}`}
      maxLength={256}
      value={fieldName ?? ""}
      onValueChange={(value) =>
        editField(embedIndex, fieldIndex, { name: value })
      }
      placeholder="Field Name"
    />
  );
}
