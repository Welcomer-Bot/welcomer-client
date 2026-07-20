"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { useContext } from "react";
import { useStore } from "zustand";
import { EmbedTextInput } from "../embed-text-input";

export function EmbedFieldValueInput({
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

  const fieldValue = embed?.fields?.[fieldIndex]?.value;

  return (
    <EmbedTextInput
      label="Field value"
      ariaLabel={`Field value ${fieldIndex + 1}`}
      maxLength={1024}
      value={fieldValue ?? ""}
      onValueChange={(value) => editField(embedIndex, fieldIndex, { value })}
      placeholder="Field Value"
    />
  );
}
