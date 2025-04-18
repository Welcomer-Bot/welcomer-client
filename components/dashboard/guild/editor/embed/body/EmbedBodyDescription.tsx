"use client";

import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Textarea } from "@heroui/input";

export function EmbedBodyDescriptionInput({
  embedIndex,
  module,
}: {
  embedIndex: number;
  module: ModuleName;
}) {
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;
  const description = store.embeds[embedIndex].description;
  const setDescription = store.setEmbedDescription;

  return (
    <Textarea
      label="Description"
      value={description ?? ""}
      onValueChange={(value) => setDescription(embedIndex, value)}
    />
  );
}
