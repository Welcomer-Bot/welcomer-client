"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleStore } from "@/state/module";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedAuthorUrlInput({ embedIndex }: { embedIndex: number }) {
    const module = useModuleStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  
  const url = store.embeds[embedIndex].author?.url;
  const setUrl = store.setEmbedAuthorUrl

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
