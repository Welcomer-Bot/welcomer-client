"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { useContext } from "react";
import { useStore } from "zustand";
import { EmbedTextInput } from "../embed-text-input";
import { EMBED_LIMITS } from "@/lib/discord/limits";

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
      maxLength={EMBED_LIMITS.fieldName}
      value={fieldName ?? ""}
      onValueChange={(value) =>
        editField(embedIndex, fieldIndex, { name: value })
      }
      placeholder="Field Name"
    />
  );
}
