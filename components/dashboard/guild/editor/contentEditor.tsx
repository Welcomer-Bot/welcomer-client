"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Textarea } from "@heroui/input";

export default function ContentEditor() {
  const moduleName = useModuleNameStore((state) => state.moduleName);
  const store = moduleName === "welcomer" ? useWelcomerStore : useLeaverStore;
  const state = store();
  const value = state.content;
  const setValue = state.setContent;

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
