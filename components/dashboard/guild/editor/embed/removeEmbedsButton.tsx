"use client";

import { Button } from "@heroui/button";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";

export default function RemoveEmbedsButton() {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;
  const clearEmbeds = store.clearEmbeds;
  const embedsLength = store.embeds.length;

  return (
    <Button
      color="danger"
      isDisabled={embedsLength == 0}
      variant="ghost"
      onPress={() => clearEmbeds()}
    >
      Clear Embeds
    </Button>
  );
}
