"use client";

import { Button } from "@nextui-org/button";

import { createEmbed } from "@/lib/actions";

export default function CreateEmbedButton({
  embedsLength,
  moduleId,
}: {
  embedsLength: number;
  moduleId: number;
}) {
  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={embedsLength >= 10}
      onClick={() => createEmbed(moduleId)}
    >
      Add Embed
    </Button>
  );
}
