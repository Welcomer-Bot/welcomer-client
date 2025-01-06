"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedFieldValueInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const module = useModuleNameStore((state) => state.moduleName);
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
