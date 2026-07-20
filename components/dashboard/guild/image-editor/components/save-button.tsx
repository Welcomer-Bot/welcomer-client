"use client";

import { updateImageCard } from "@/features/dashboard/modules/actions";
import {
  ImageCardStoreContext,
  useImageCardStore,
} from "@/features/dashboard/modules/providers";
import { UnsavedChangesBar } from "@/components/dashboard/guild/unsaved-changes-bar";
import { useUnsavedChanges } from "@/components/dashboard/guild/hooks/use-unsaved-changes";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

interface SaveButtonProps {
  guildId: string;
}

export function SaveButton({ guildId }: SaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(ImageCardStoreContext);
  if (!store) throw new Error("Missing ImageCardStoreProvider in the tree");

  const state = useStore(store, (state) => state);
  const reset = useImageCardStore((state) => state.reset);

  // Baseline recomputed whenever the store instance changes (see
  // use-unsaved-changes.ts for why that resync matters).
  const baselineSnapshot = useMemo(
    () => JSON.stringify(store.getInitialState().data),
    [store],
  );
  const currentSnapshot = useMemo(
    () => JSON.stringify(state.data),
    [state.data],
  );

  const { hasChanges, markSaved, markReset } = useUnsavedChanges(
    currentSnapshot,
    baselineSnapshot,
  );

  if (!hasChanges || !state.id) return null;

  return (
    <UnsavedChangesBar
      isLoading={isLoading}
      onReset={() => {
        reset();
        markReset();
      }}
      onSave={async () => {
        if (!state.id || !state.sourceId) return;

        setIsLoading(true);
        try {
          const {
            data: updatedData,
            done,
            error,
          } = await updateImageCard(
            {
              id: state.id,
              sourceId: state.sourceId,
              data: state.data,
            },
            guildId,
          );

          if (error) {
            toast.error(error);
          } else if (done && updatedData) {
            toast.success("Settings updated successfully!");
            markSaved();
          }
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "An error occurred",
          );
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
