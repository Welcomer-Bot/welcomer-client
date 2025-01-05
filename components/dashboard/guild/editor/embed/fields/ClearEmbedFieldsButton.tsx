"use client";

import { Button } from "@nextui-org/button";

import { useWelcomerStore } from "@/state/welcomer";
import { useModuleStore } from "@/state/module";
import { useLeaverStore } from "@/state/leaver";

export default function ClearEmbedFieldsButton({
  embedIndex,
}: {
  embedIndex: number;
  }) {
    const module = useModuleStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  
  const clearFields = store.clearFields;
  const fieldsLength = store.embeds[embedIndex].fields.length

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
