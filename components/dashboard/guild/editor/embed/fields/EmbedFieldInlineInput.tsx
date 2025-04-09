"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Checkbox } from "@heroui/checkbox";

export function EmbedFieldInlineInput({
  embedIndex,
  fieldIndex,
  module,
}: {
  embedIndex: number;
  fieldIndex: number;
  module: ModuleName;
}) {
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const fieldInline = store.embeds[embedIndex].fields[fieldIndex].inline;

  const setFieldInline = store.setFieldInline;

  return (
    <Checkbox
      isSelected={fieldInline ?? false}
      onValueChange={(value) => setFieldInline(embedIndex, fieldIndex, value)}
    >
      Inline
    </Checkbox>
  );
}
