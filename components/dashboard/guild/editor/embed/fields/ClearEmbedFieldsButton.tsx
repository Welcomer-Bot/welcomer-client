"use client";

import { Button } from "@heroui/button";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";

export default function ClearEmbedFieldsButton({
  module,
  embedIndex,
}: {
  module: ModuleName  
  embedIndex: number;
}) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;

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
