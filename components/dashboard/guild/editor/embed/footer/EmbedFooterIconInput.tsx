"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedFooterIconInput({ embedIndex }: { embedIndex: number }) {
  const icon = useWelcomerStore(
    (state) => state.embeds[embedIndex].footer?.iconUrl
  );
  const setIcon = useWelcomerStore((state) => state.setEmbedFooterIcon);

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
