"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@heroui/input";

export function EmbedFieldNameInput({
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
