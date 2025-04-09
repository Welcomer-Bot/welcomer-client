"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedBodyColorInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
    const welcomerStore = useWelcomerStore();
    const leaverStore = useLeaverStore();
    const store = module === "welcomer" ? welcomerStore : leaverStore;
 const embedColor = store.embeds[embedIndex].color;
  const setEmbedColor = store.setEmbedColor;

  return (
    <Input
      type="color"
      value={embedColor ?? undefined}
      onValueChange={(value) => setEmbedColor(embedIndex, value)}
    />
  );
}
