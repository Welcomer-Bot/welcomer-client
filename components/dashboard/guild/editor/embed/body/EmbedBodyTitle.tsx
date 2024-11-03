"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";

export function EmbedBodyTitleInput({ embedIndex }: { embedIndex: number }) {
  const embedTitle =
    useWelcomerStore((state) => state.embeds[embedIndex].title) ?? "";
  const setEmbedTitle = useWelcomerStore((state) => state.setEmbedTitle);

  return (
    <Input
      label={"Title " + `( ${embedTitle?.length ?? 0}/256 )`}
      validate={(value) => {
        if (value.length > 256) return "Title must not exceed 256 characters!";
      }}
      value={embedTitle}
      onValueChange={(value) => setEmbedTitle(embedIndex, value)}
    />
  );
}
