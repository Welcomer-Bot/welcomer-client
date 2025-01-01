"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@nextui-org/button";

export default function AddEmbedFieldsButton({ embedIndex }: { embedIndex: number }) {
  const addField = useWelcomerStore((state) => state.addField);
  const fieldsLength = useWelcomerStore((state) => state.embeds[embedIndex].fields.length);
  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={fieldsLength >= 25}
      onPress={() => fieldsLength < 25 && addField(embedIndex)}
    >
      Add Field
    </Button>
  );
}
