"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedFooterNameInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
   const welcomerStore = useWelcomerStore();
   const leaverStore = useLeaverStore();
   const store = module === "welcomer" ? welcomerStore : leaverStore;
  const footer = store.embeds[embedIndex].footer?.text;
  const setFooter = store.setEmbedFooterText;

  return (
    <Input
      type="text"
      label={`Footer text ( ${footer?.length ?? 0}/2048 )`}
      aria-label="Text"
      validate={(value) => {
        if (value.length > 2048)
          return "Footer must not exceed 2048 characters!";
      }}
      value={footer ?? ""}
      onValueChange={(value) => setFooter(embedIndex, value)}
    />
  );
}
