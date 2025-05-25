"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/react";
import { useContext } from "react";
import { useStore } from "zustand";

export default function CreateEmbedButton() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embedsLength = useStore(store, (state) => state.embeds.length);
  const addDefaultEmbed = useStore(store, (state) => state.addDefaultEmbed);

  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      isDisabled={embedsLength >= 10}
      onPress={() => embedsLength < 10 && addDefaultEmbed()}
    >
      Add Embed
    </Button>
  );
}
