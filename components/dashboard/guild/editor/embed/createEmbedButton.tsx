"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Button } from "@heroui/button";

export default function CreateEmbedButton({ module }: { module: ModuleName }) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;
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
