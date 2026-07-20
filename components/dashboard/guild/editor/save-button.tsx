"use client";

import { updateSource } from "@/features/dashboard/modules/actions";
import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { SourceState } from "@/features/dashboard/modules/stores";
import { UnsavedChangesBar } from "@/components/dashboard/guild/unsaved-changes-bar";
import { useUnsavedChanges } from "@/components/dashboard/guild/hooks/use-unsaved-changes";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

type TrackedSourceFields = Pick<
  SourceState,
  "channelId" | "message" | "imagePosition" | "imageEmbedIndex"
>;

function toSnapshot(state: TrackedSourceFields) {
  return JSON.stringify({
    channelId: state.channelId,
    message: state.message,
    imagePosition: state.imagePosition,
    imageEmbedIndex: state.imageEmbedIndex,
  });
}

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const state = useStore(store, (state) => state);
  const reset = useStore(store, (state) => state.reset);

  // Baseline recomputed whenever the store instance changes (see
  // use-unsaved-changes.ts for why that resync matters).
  const baselineSnapshot = useMemo(
    () => toSnapshot(store.getInitialState()),
    [store],
  );
  const currentSnapshot = useMemo(() => toSnapshot(state), [state]);

  const { hasChanges, markSaved, markReset } = useUnsavedChanges(
    currentSnapshot,
    baselineSnapshot,
  );

  if (!hasChanges) return null;

  return (
    <UnsavedChangesBar
      isLoading={isLoading}
      onReset={() => {
        reset();
        markReset();
      }}
      onSave={async () => {
        setIsLoading(true);
        try {
          const { done, error } = await updateSource({
            guildId: state.guildId,
            id: state.id,
            channelId: state.channelId,
            message: state.message,
            imagePosition: state.imagePosition,
            imageEmbedIndex: state.imageEmbedIndex,
          });
          if (error) {
            toast.error(error);
          } else if (done) {
            toast.success("Settings updated successfully!");
            markSaved();
          }
        } catch (err) {
          // Fixed: this call could throw (e.g. network failure) instead of
          // resolving to `{ error }`; without a catch, isLoading was never
          // reset and the user saw no feedback at all.
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
