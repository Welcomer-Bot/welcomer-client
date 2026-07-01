"use client";

import { updateSource } from "@/features/dashboard/modules/actions";
import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { UnsavedChangesBar } from "@/components/dashboard/guild/unsaved-changes-bar";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const state = useStore(store, (state) => state);
  const reset = useStore(store, (state) => state.reset);

  const lastSavedStateRef = useRef<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Store is recreated from freshly-revalidated server data after each save
    // (provider useMemo keyed on initialState). Re-sync the baseline to the
    // server-normalized initial state so a save-then-reload doesn't re-trigger
    // the unsaved-changes bar from server-injected fields (e.g. card image URL).
    const initialState = store.getInitialState();
    lastSavedStateRef.current = JSON.stringify({
      channelId: initialState.channelId,
      message: initialState.message,
      imagePosition: initialState.imagePosition,
      imageEmbedIndex: initialState.imageEmbedIndex,
    });
  }, [store]);

  const currentStateStr = useMemo(
    () =>
      JSON.stringify({
        channelId: state.channelId,
        message: state.message,
        imagePosition: state.imagePosition,
        imageEmbedIndex: state.imageEmbedIndex,
      }),
    [state.channelId, state.message, state.imagePosition, state.imageEmbedIndex],
  );

  useEffect(() => {
    if (lastSavedStateRef.current !== null) {
      setHasChanges(currentStateStr !== lastSavedStateRef.current);
    }
  }, [currentStateStr]);

  if (!hasChanges) return null;

  return (
    <UnsavedChangesBar
      isLoading={isLoading}
      onReset={() => {
        reset();
        const initialState = store.getInitialState();
        lastSavedStateRef.current = JSON.stringify({
          channelId: initialState.channelId,
          message: initialState.message,
          imagePosition: initialState.imagePosition,
          imageEmbedIndex: initialState.imageEmbedIndex,
        });
        setHasChanges(false);
      }}
      onSave={async () => {
        setIsLoading(true);
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
          lastSavedStateRef.current = currentStateStr;
          setHasChanges(false);
        }
        setIsLoading(false);
      }}
    />
  );
}
