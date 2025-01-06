"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedBodyColorInput({ embedIndex }: { embedIndex: number }) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
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
