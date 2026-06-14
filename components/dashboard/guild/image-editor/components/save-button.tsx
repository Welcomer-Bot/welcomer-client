"use client";

import { updateImageCard } from "@/features/dashboard/modules/actions";
import {
  ImageCardStoreContext,
  useImageCardStore,
} from "@/features/dashboard/modules/providers";
import { UnsavedChangesBar } from "@/components/dashboard/guild/unsaved-changes-bar";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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

  const lastSavedDataRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSavedDataRef.current === null) {
      lastSavedDataRef.current = JSON.stringify(store.getInitialState().data);
    }
  }, [store]);

  const currentDataStr = useMemo(
    () => JSON.stringify(state.data),
    [state.data],
  );

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (lastSavedDataRef.current !== null) {
      setHasChanges(currentDataStr !== lastSavedDataRef.current);
    }
  }, [currentDataStr]);

  if (!hasChanges || !state.id) return null;

  return (
    <UnsavedChangesBar
      isLoading={isLoading}
      onReset={() => {
        reset();
        lastSavedDataRef.current = JSON.stringify(
          store.getInitialState().data,
        );
        setHasChanges(false);
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
            lastSavedDataRef.current = currentDataStr;
            setHasChanges(false);
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
