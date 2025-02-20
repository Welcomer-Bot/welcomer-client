"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@heroui/button";

export default function CreateEmbedButton() {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;
  const addDefaultEmbed = store.addDefaultEmbed;
  const embedsLength = store.embeds.length;
  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={embedsLength >= 10}
      onPress={() => embedsLength < 10 && addDefaultEmbed()}
    >
      Add Embed
    </Button>
  );
}
