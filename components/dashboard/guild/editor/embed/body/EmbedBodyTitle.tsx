"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Input } from "@heroui/input";

export function EmbedBodyTitleInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const embedTitle = store.embeds[embedIndex].title ?? "";
  const setEmbedTitle = store.setEmbedTitle;

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
