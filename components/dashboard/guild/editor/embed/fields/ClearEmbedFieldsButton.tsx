"use client";

import { Button } from "@nextui-org/button";

import { useWelcomerStore } from "@/state/welcomer";

export default function ClearEmbedFieldsButton({ embedIndex }: { embedIndex: number }) {
    const clearFields = useWelcomerStore((state) => state.clearFields);
    const fieldsLength = useWelcomerStore((state) => state.embeds[embedIndex].fields.length);
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
