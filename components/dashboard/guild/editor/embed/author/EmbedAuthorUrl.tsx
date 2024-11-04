"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedAuthorUrlInput({ embedIndex }: { embedIndex: number }) {
  const url = useWelcomerStore((state) => state.embeds[embedIndex].author?.url);
  const setUrl = useWelcomerStore((state) => state.setEmbedAuthorUrl);

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
