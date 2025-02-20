"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@heroui/input";

export function EmbedAuthorUrlInput({ embedIndex }: { embedIndex: number }) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;

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
