"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Checkbox } from "@nextui-org/checkbox";

export function EmbedFieldInlineInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const fieldInline = useWelcomerStore(
    (state) => state.embeds[embedIndex].fields[fieldIndex].inline
  );
  const setFieldInline = useWelcomerStore((state) => state.setFieldInline);

  return (
    <Checkbox
      isSelected={fieldInline ?? false}
      onValueChange={(value) => setFieldInline(embedIndex, fieldIndex, value)}
      >
        Inline
    </Checkbox>
  );
}
