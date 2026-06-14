"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Button } from "@heroui/button";
import { useContext } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { useStore } from "zustand";

export default function RemoveEmbedsButton() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embedsLength = useStore(
    store,
    (state) => state.message?.embeds?.length || 0,
  );
  const clearEmbeds = useStore(store, (state) => state.clearEmbeds);

  return (
    <Button
      color="danger"
      isDisabled={embedsLength == 0}
      variant="flat"
      onPress={() => clearEmbeds()}
      startContent={<HiOutlineTrash />}
    >
      Clear All Embeds
    </Button>
  );
}
