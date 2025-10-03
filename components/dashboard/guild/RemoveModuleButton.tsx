"use client";
import { removeSource } from "@/lib/actions";
import { SourceType } from "@/prisma/generated/client";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/react";
import { usePlausible } from "next-plausible";
import { useContext, useState } from "react";
import { useStore } from "zustand";

export default function RemoveModuleButton({
  guildId,
  sourceId,
  sourceType,
}: {
  guildId: string;
  sourceId: number;
  sourceType: SourceType;
}) {
  const [loading, setLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const reset = useStore(store, (state) => state.reset);
  const plausible = usePlausible();
  return (
    <Button
      color="danger"
      variant="ghost"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        plausible("RemoveModuleButton", {
          props: {
            sourceType,
          },
        });
        await removeSource(guildId, sourceId, sourceType);
        reset();
      }}
    >
      Disable {sourceType}
    </Button>
  );
}
