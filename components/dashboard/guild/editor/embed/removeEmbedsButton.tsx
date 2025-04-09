"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Button } from "@heroui/button";

export default function RemoveEmbedsButton({ module }: { module: ModuleName }) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;
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
