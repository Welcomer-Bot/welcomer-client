"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@heroui/button";

export default function AddEmbedFieldsButton({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;

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
