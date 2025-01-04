"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedBodyColorInput({ embedIndex }: { embedIndex: number }) {
  const embedColor = useWelcomerStore(
    (state) => state.embeds[embedIndex].color
  );
  const setEmbedColor = useWelcomerStore((state) => state.setEmbedColor);
  console.log(embedColor);
  return (
    <Input
      type="color"
      value={embedColor ?? undefined}
      onValueChange={(value) => setEmbedColor(embedIndex, value)}
    />
  );
}
