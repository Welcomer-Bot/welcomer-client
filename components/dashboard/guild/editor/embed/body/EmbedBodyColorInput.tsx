"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@heroui/input";

export function EmbedBodyColorInput({ embedIndex }: { embedIndex: number }) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;
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
