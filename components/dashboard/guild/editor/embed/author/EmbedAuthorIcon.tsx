"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedAuthorIconInput({ embedIndex }: { embedIndex: number }) {
  const icon = useWelcomerStore(
    (state) => state.embeds[embedIndex].author?.iconUrl
  );
  const setIcon = useWelcomerStore((state) => state.setEmbedAuthorIcon);

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
