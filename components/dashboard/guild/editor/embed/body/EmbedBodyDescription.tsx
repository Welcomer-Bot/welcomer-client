"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";

export function EmbedBodyDescriptionInput({
  description,
}: {
  description: string | null | undefined;
}) {
  const [value, setValue] = useState(description ?? "");

  return (
    <Input
      label={"Description " + `( ${value?.length ?? 0}/256 )`}
      validate={(value) => {
        if (value.length > 2048) return "Description must not exceed 2048 characters!";
      }}
      value={value}
      onValueChange={setValue}
    />
  );
}
