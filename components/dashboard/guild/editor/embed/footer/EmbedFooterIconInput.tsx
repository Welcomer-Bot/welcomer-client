"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";

export function EmbedFooterIconInput({
  icon,
}: {
  icon: string | null | undefined;
}) {
  const [value, setValue] = useState(icon ?? "");

  return <Input label={"Icon url"} value={value} onValueChange={setValue} />;
}
