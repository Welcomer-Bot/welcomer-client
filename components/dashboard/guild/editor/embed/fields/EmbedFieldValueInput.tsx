"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedFieldValueInput({
  embedIndex,
  fieldIndex,
  module,
}: {
  embedIndex: number;
  fieldIndex: number;
  module: ModuleName;
}) {
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const fieldValue = store.embeds[embedIndex].fields[fieldIndex].value;

  const setFieldValue = store.setFieldValue;

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
