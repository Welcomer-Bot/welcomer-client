"use client";

import { useImageStore } from "@/state/image";
import { Input } from "@nextui-org/input";

export function ImageContentInput({
  textType,
}: {
  textType: "mainText" | "secondText";
}) {
  const content = useImageStore(
    (state) => state.getActiveCard()![textType]?.content
  );
  const setContent =
    textType === "mainText"
      ? useImageStore((state) => state.setMainTextContent)
      : useImageStore((state) => state.setSecondTextContent);

  return (
    <Input
      type="text"
      label={`Content ( ${content?.length ?? 0}/256 )`}
      aria-label="Content"
      validate={(value) => {
        if (value.length > 256)
          return "Content must not exceed 256 characters!";
      }}
      value={content ?? ""}
      onValueChange={(value) => setContent(value)}
    />
  );
}
