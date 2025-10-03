"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/react";
import { useContext } from "react";
import { useStore } from "zustand";

export default function RemoveEmbedsButton() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embedsLength = useStore(
    store,
    (state) => state.message?.embeds?.length || 0
  );
  const clearEmbeds = useStore(store, (state) => state.clearEmbeds);

  return (
    <Button
      color="danger"
      isDisabled={embedsLength == 0}
      variant="ghost"
      onPress={() => clearEmbeds()}
    >
      Clear Embeds
    </Button>
  );
}
