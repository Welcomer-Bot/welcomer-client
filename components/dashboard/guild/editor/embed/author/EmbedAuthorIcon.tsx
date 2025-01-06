"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedAuthorIconInput({ embedIndex }: { embedIndex: number }) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const icon = store.embeds[embedIndex].author?.iconUrl;
  const setIcon = store.setEmbedAuthorIcon;

  return (
    <Input
      type="url"
      isClearable
      label="Icon url"
      aria-label="Icon url"
      value={icon ?? ""}
      onValueChange={(value) => setIcon(embedIndex, value)}
    />
  );
}
