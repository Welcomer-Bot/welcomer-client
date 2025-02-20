"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Checkbox } from "@heroui/checkbox";

export function EmbedFieldInlineInput({
  embedIndex,
  fieldIndex,
}: {
  embedIndex: number;
  fieldIndex: number;
}) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;

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
