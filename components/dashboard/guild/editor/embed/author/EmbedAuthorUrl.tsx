"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedAuthorUrlInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;
  const url = store.embeds[embedIndex].author?.url;
  const setUrl = store.setEmbedAuthorUrl;

  return (
    <Input
      type="url"
      isClearable
      aria-label="Author url"
      label="Author url"
      value={url ?? ""}
      onValueChange={(value) => setUrl(embedIndex, value)}
    />
  );
}
