"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedFieldNameInput({
  embedIndex,
  fieldIndex,
  module,
}: {
  embedIndex: number;
  fieldIndex: number;
  module: ModuleName;
}) {
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const fieldName = store.embeds[embedIndex].fields[fieldIndex].name;

  const setFieldName = store.setFieldName;

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
