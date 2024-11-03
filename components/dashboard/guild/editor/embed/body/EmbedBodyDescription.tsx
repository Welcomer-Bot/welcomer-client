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
      label={"Description " + `( ${description?.length ?? 0}/2048 )`}
      validate={(value) => {
        if (value.length > 2048)
          return "Description must not exceed 2048 characters!";
      }}
      value={description}
      onValueChange={(value) => setDescription(embedIndex, value)}
    />
  );
}
