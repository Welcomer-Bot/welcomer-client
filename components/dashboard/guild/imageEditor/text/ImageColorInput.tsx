"use client";

import { useImageStore } from "@/state/image";
import { ImageTextType } from "@/types";
import { Input } from "@nextui-org/input";
import { Color } from "@welcomer-bot/card-canvas";

export function ImageColorInput({
  textType,
}: {
  textType: ImageTextType;
}) {
  const color = useImageStore((state) => state.getActiveCard()![textType]?.color);
  const setColor = useImageStore((state) => state.setTextColor);
  return (
    <Input
      type="color"
      aria-label="Color"
      value={color ?? ""}
      onValueChange={(value) => setColor(textType, value as Color)}
    />
  );
}
