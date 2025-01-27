"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Textarea } from "@heroui/input";

export function EmbedBodyDescriptionInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const description = store.embeds[embedIndex].description ?? "";
  const setDescription = store.setEmbedDescription;

  return (
    <Textarea
      label={"Description " + `( ${description?.length ?? 0}/4096 )`}
      validate={(value) => {
        if (value.length > 4096)
          return "Description must not exceed 4096 characters!";
      }}
      value={description}
      onValueChange={(value) => setDescription(embedIndex, value)}
    />
  );
}
