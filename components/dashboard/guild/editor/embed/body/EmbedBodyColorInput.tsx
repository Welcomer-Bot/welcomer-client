"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";

export function EmbedBodyColorInput({
  color,
}: {
  color: number | null | undefined;
}) {
  const [value, setValue] = useState(color ?? "");

  return (
    <Input
      type="color"
      validate={(value) => {
        if (value.length > 2048)
          return "color must not exceed 2048 characters!";
      }}
      value={value.toString()}
      onValueChange={setValue}
    />
  );
}
