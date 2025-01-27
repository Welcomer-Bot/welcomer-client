"use client";

import { Button } from "@heroui/button";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";

export default function ClearEmbedFieldsButton({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const clearFields = store.clearFields;
  const fieldsLength = store.embeds[embedIndex].fields.length;

  return (
    <Button
      color="danger"
      isDisabled={fieldsLength == 0}
      variant="ghost"
      onPress={() => clearFields(embedIndex)}
    >
      Clear Embeds
    </Button>
  );
}
