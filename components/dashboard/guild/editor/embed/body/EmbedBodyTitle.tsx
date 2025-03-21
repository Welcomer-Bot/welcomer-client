"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@heroui/input";

export function EmbedBodyTitleInput({ embedIndex }: { embedIndex: number }) {
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = currentModuleName === "welcomer" ? welcomerStore : leaverStore;
  const embedTitle = store.embeds[embedIndex].title ?? "";
  const setEmbedTitle = store.setEmbedTitle;

  return (
    <Input
      label={"Title " + `( ${embedTitle?.length ?? 0}/256 )`}
      validate={(value) => {
        if (value.length > 256) return "Title must not exceed 256 characters!";
      }}
      value={embedTitle}
      onValueChange={(value) => setEmbedTitle(embedIndex, value)}
    />
  );
}
