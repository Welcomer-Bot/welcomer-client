"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";

export function EmbedBodyTitleInput({
  title,
}: {
  title: string | null | undefined;
}) {
  const [value, setValue] = useState(title ?? "");

  return (
    <Input
      label={"Title " + `( ${value?.length ?? 0}/256 )`}
      validate={(value) => {
        if (value.length > 256) return "Title must not exceed 256 characters!";
      }}
      value={value}
      onValueChange={setValue}
    />
  );
}
