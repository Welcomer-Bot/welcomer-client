"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { Textarea } from "@nextui-org/input";

export default function ContentEditor() {
  const value = useWelcomerStore((state) => state.content);
  const setValue = useWelcomerStore((state) => state.setContent);

  return (
    <Textarea
      label={"Content " + `( ${value?.length ?? 0}/2000 )`}
      placeholder="Welcome {user} to {guild}!"
      validate={(value) => {
        if (value.length > 2000)
          return "Content must not exceed 2000 characters!";
      }}
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
