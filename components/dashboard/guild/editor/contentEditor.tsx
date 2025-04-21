"use client";

import { Textarea } from "@heroui/input";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { useContext } from "react";
import { useStore } from "zustand";

export default function ContentEditor() {
    const store = useContext(SourceStoreContext);
    if (!store) throw new Error("Missing SourceStore.Provider in the tree");
    const value = useStore(store, (state) => state.content);
    const setValue = useStore(store, (state) => state.setChannelId);

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
