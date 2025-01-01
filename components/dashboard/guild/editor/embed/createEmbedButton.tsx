"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@nextui-org/button";

export default function CreateEmbedButton() {
  const addDefaultEmbed = useWelcomerStore((state) => state.addDefaultEmbed);
  const embedsLength = useWelcomerStore((state) => state.embeds).length;
  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={embedsLength >= 10}
      onPress={() => embedsLength < 10 && addDefaultEmbed()}
    >
      Add Embed
    </Button>
  );
}
