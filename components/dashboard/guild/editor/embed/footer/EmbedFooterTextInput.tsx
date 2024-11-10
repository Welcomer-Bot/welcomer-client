"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedFooterNameInput({ embedIndex }: { embedIndex: number }) {
  const footer = useWelcomerStore(
    (state) => state.embeds[embedIndex].footer?.text
  );
  const setFooter = useWelcomerStore((state) => state.setEmbedFooterText);

  return (
    <Input
      type="text"
      label={`Footer text ( ${footer?.length ?? 0}/2048 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 256) return "Footer must not exceed 2048 characters!";
      }}
      value={footer ?? ""}
      onValueChange={(value) => setFooter(embedIndex, value)}
    />
  );
}
