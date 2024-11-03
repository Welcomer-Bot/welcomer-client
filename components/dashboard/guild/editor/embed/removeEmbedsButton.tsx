"use client";

import { Button } from "@nextui-org/button";

import { useWelcomerStore } from "@/state/welcomer";

export default function RemoveEmbedsButton() {
  const clearEmbeds = useWelcomerStore((state) => state.clearEmbeds);
  const embedsLength = useWelcomerStore((state) => state.embeds).length;

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
