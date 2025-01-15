"use client";

import { useImageStore } from "@/state/image";
import { Input } from "@nextui-org/input";
import { Color } from "@welcomer-bot/card-canvas";

export function ImageColorInput({
  textType,
}: {
  textType: "mainText" | "secondText";
}) {
  const color = useImageStore((state) => state.getActiveCard()![textType]?.color);
  const setColor =
    textType === "mainText"
      ? useImageStore((state) => state.setMainTextColor)
      : useImageStore((state) => state.setSecondTextColor);

  return (
    <Input
      type="color"
      aria-label="Color"
      value={color ?? ""}
      onValueChange={(value) => setColor(value as Color)}
    />
  );
}
