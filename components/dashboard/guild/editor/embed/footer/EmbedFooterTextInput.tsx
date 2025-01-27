"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@heroui/input";

export function EmbedFooterNameInput({ embedIndex }: { embedIndex: number }) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
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
