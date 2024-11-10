"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Textarea } from "@nextui-org/input";

export function EmbedBodyDescriptionInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const description =
    useWelcomerStore((state) => state.embeds[embedIndex].description) ?? "";
  const setDescription = useWelcomerStore((state) => state.setEmbedDescription);

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
