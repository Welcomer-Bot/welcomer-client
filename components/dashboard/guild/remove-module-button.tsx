"use client";
import { removeSource } from "@/lib/actions";
import { SourceType } from "@/prisma/generated/client";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/button";
import { usePlausible } from "next-plausible";
import { useContext } from "react";
import { useFormStatus } from "react-dom";
import { useStore } from "zustand";

function SubmitButton({ sourceType }: { sourceType: SourceType }) {
  const { pending } = useFormStatus();

  return (
    <Button color="danger" variant="ghost" isLoading={pending} type="submit">
      Disable {sourceType}
    </Button>
  );
}

export default function RemoveModuleButton({
  guildId,
  sourceId,
  sourceType,
}: {
  guildId: string;
  sourceId: number;
  sourceType: SourceType;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const reset = useStore(store, (state) => state.reset);
  const plausible = usePlausible();

  async function handleSubmit() {
    plausible("RemoveModuleButton", {
      props: {
        sourceType,
      },
    });
    await removeSource(guildId, sourceId);
    reset();
  }

  return (
    <form action={handleSubmit}>
      <SubmitButton sourceType={sourceType} />
    </form>
  );
}
