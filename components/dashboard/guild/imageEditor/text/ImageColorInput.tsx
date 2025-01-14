"use client";

import { useImageStore } from "@/state/image";
import { Input } from "@nextui-org/input";

export function ImageColorInput({
  textType,
}: {
  textType: "mainText" | "secondText";
}) {
  const content = useImageStore((state) => state.activeCard ? state.activeCard[textType]?.color : "");
  const setColor =
    textType === "mainText"
      ? useImageStore((state) => state.setMainTextColor)
      : useImageStore((state) => state.setSecondTextColor);

  return (
    <Input
      type="color"
      aria-label="Content"
      value={content ?? ""}
      onValueChange={(value) => setColor(value)}
    />
  );
}
