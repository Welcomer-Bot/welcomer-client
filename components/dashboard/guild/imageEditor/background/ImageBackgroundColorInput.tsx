"use client";

import { useImageStore } from "@/state/image";
import { Input } from "@heroui/input";
import { Color } from "@welcomer-bot/card-canvas";

export function ImageBackgroundColorInput() {
  const color = useImageStore(
    (state) => state.getActiveCard()?.backgroundColor
  );
  const setColor = useImageStore((state) => state.setBackgroundColor);

  return (
    <Input
      type="color"
      aria-label="Color"
      value={color ?? ""}
      onValueChange={(value) => setColor(value as Color)}
    />
  );
}
