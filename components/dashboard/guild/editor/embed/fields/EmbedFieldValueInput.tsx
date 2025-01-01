"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedFieldValueInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const fieldValue = useWelcomerStore(
    (state) => state.embeds[embedIndex].fields[fieldIndex].value
  );
  const setFieldValue = useWelcomerStore((state) => state.setFieldValue);

  return (
    <Input
      type="text"
      label={`Footer text ( ${fieldValue?.length ?? 0}/1024 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 1024) return "Footer must not exceed 1024 characters!";
      }}
      value={fieldValue ?? ""}
      onValueChange={(value) => setFieldValue(embedIndex, fieldIndex, value)}
    />
  );
}
