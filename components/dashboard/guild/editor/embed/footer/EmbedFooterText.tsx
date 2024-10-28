"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";

export function EmbedFooterTextInput({
  text,
}: {
  text: string | null | undefined;
}) {
  const [value, setValue] = useState(text ?? "");

  return <Input label={"Text"} value={value} onValueChange={setValue} />;
}
