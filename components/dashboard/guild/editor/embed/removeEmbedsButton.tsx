"use client";

import { Button } from "@nextui-org/button";

import { useCurrentMessageStore } from "@/state/embeds";

export default function RemoveEmbedsButton({
  embedsLength,
}: {
  embedsLength: number;
  moduleId: number;
}) {
  const clearEmbeds = useCurrentMessageStore((state) => state.clearEmbeds);

  return (
    <Button
      color="danger"
      isDisabled={embedsLength == 0}
      variant="ghost"
      onClick={() => clearEmbeds()}
    >
      Clear Embeds
    </Button>
  );
}
