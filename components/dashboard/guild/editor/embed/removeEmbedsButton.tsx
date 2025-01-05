"use client";

import { Button } from "@nextui-org/button";

import { useWelcomerStore } from "@/state/welcomer";
import { useModuleStore } from "@/state/module";
import { useLeaverStore } from "@/state/leaver";

export default function RemoveEmbedsButton() {
    const module = useModuleStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
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
