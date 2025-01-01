"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedFieldNameInput({ embedIndex, fieldIndex }: { embedIndex: number, fieldIndex: number }) {
  const fieldName = useWelcomerStore((state) => state.embeds[embedIndex].fields[fieldIndex].name);
  const setFieldName = useWelcomerStore((state) => state.setFieldName);

  return (
    <Input
      type="text"
      label={`Footer text ( ${fieldName?.length ?? 0}/256 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 256)
          return "Footer must not exceed 256 characters!";
      }}
      value={fieldName ?? ""}
      onValueChange={(value) => setFieldName(embedIndex, fieldIndex, value)}
    />
  );
}
