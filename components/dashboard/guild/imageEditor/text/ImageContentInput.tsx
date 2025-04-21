"use client";

import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { ImageTextType } from "@/types";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";

export function ImageContentInput({ textType }: { textType: ImageTextType }) {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const content = useStore(
    store,
    (state) => state.getActiveCard()![textType]?.content
  );
  const setContent = useStore(store, (state) => state.setTextContent);

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
      onValueChange={(value) => setContent(textType, value)}
    />
  );
}
