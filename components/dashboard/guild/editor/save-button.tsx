"use client";

import { updateSource } from "@/features/dashboard/modules/actions";
import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { selectSourceHasChanges } from "@/features/dashboard/modules/stores";
import { UnsavedChangesBar } from "@/components/dashboard/guild/unsaved-changes-bar";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");

  // Single subscription, to a boolean: this button only re-renders when the
  // dirty flag flips. Reading the state itself is deferred to the handlers —
  // subscribing to it would re-render on every keystroke in the editor.
  const hasChanges = useStore(store, selectSourceHasChanges);

  if (!hasChanges) return null;

  return (
    <UnsavedChangesBar
      isLoading={isLoading}
      onReset={() => store.getState().reset()}
      onSave={async () => {
        const state = store.getState();

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
            state.markSaved();
          }
        } catch (err) {
          // This call can throw (e.g. network failure) instead of resolving to
          // `{ error }`; without a catch, isLoading was never reset and the
          // user saw no feedback at all.
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
