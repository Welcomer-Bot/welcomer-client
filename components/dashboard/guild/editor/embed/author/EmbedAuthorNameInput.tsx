"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Input } from "@heroui/input";

export function EmbedAuthorNameInput({ embedIndex }: { embedIndex: number }) {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const author = store.embeds[embedIndex].author?.name;
  const setAuthor = store.setEmbedAuthorName;

  return (
    <Input
      type="text"
      label={`Name ( ${author?.length ?? 0}/256 )`}
      aria-label="Author"
      validate={(value) => {
        if (value.length > 256) return "Author must not exceed 256 characters!";
      }}
      value={author ?? ""}
      onValueChange={(value) => setAuthor(embedIndex, value)}
    />
  );
}
