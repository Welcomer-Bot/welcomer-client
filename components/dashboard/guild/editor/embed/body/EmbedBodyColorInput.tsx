"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@nextui-org/input";
import { useState } from "react";

export function EmbedBodyColorInput({
  embedIndex,
}: {
  embedIndex: number
}) {
  const embedColor = useWelcomerStore((state) => state.embeds[embedIndex].color) ?? "";
  const setEmbedColor = useWelcomerStore((state) => state.setEmbedColor);

  return (
    <Input
      type="color"
      validate={(value) => {
        if (value.length > 2048)
          return "color must not exceed 2048 characters!";
      }}
      value={embedColor.toString()}
      onValueChange={(value) => setEmbedColor(embedIndex, Number(value))}
    />
  );
}
