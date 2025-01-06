"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@nextui-org/button";

export default function AddEmbedFieldsButton({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const addField = store.addField;
  const fieldsLength = store.embeds[embedIndex].fields.length;
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
