"use client";

import { updateImageCard } from "@/features/dashboard/modules/actions";
import { ImageCardStoreContext } from "@/features/dashboard/modules/providers";
import {
  selectImageCardError,
  selectImageCardHasChanges,
} from "@/features/dashboard/modules/stores";
import { UnsavedChangesBar } from "@/components/dashboard/guild/unsaved-changes-bar";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

interface SaveButtonProps {
  guildId: string;
}

export function SaveButton({ guildId }: SaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(ImageCardStoreContext);
  if (!store) throw new Error("Missing ImageCardStoreProvider in the tree");

  // Scalar subscriptions only: this button re-renders when the dirty flag
  // flips or the card changes, not on every config tweak.
  const hasChanges = useStore(store, selectImageCardHasChanges);
  const cardId = useStore(store, (state) => state.id);
  const error = useStore(store, selectImageCardError);

  if (!hasChanges || !cardId) return null;

  return (
    <UnsavedChangesBar
      error={error}
      isLoading={isLoading}
      onReset={() => store.getState().reset()}
      onSave={async () => {
        const state = store.getState();
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
            state.markSaved();
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
