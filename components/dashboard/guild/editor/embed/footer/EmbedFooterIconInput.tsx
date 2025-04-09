"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedFooterIconInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const icon = store.embeds[embedIndex].footer?.iconUrl;

  const setIcon = store.setEmbedFooterIcon;

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
