"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleStore } from "@/state/module";
import { useWelcomerStore } from "@/state/welcomer";
import { Checkbox } from "@nextui-org/checkbox";

export function EmbedFieldInlineInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const module = useModuleStore((state) => state.moduleName);
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
