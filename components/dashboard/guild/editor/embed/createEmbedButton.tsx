"use client";

import { getUniqueId } from "@/lib/utils";
import { useCurrentMessageStore } from "@/state/embeds";
import { Button } from "@nextui-org/button";

export default function CreateEmbedButton({
  embedsLength,
}: {
  embedsLength: number;
}) {
  const addEmbed = useCurrentMessageStore((state) => state.addEmbed);

  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={embedsLength >= 10}
      onClick={() =>
        embedsLength < 10 &&
        addEmbed({
          id: getUniqueId(),
          description: "",
          fields: [],
        })
      }
    >
      Add Embed
    </Button>
  );
}
