"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Button } from "@heroui/button";
import { useContext } from "react";
import { IoIosAdd } from "react-icons/io";
import { useStore } from "zustand";

export default function CreateEmbedButton() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const embedsLength = useStore(
    store,
    (state) => state.message?.embeds?.length || 0,
  );
  const addDefaultEmbed = useStore(store, (state) => state.addEmbed);

  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      variant="flat"
      isDisabled={embedsLength >= 10}
      onPress={() => embedsLength < 10 && addDefaultEmbed()}
      startContent={<IoIosAdd />}
    >
      Add Embed
    </Button>
  );
}
