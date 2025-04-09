"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedAuthorIconInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;
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
