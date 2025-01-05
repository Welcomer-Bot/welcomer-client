"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleStore } from "@/state/module";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedBodyColorInput({ embedIndex }: { embedIndex: number }) {
    const module = useModuleStore((state) => state.moduleName);
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
