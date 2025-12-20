"use client";

import { updateSource } from "@/lib/actions";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const state = useStore(store, (state) => state);

  // Track the last saved state
  const lastSavedStateRef = useRef<string | null>(null);

  // Initialize the last saved state ref on mount using useEffect
  useEffect(() => {
    if (lastSavedStateRef.current === null) {
      const initialState = store.getInitialState();
      lastSavedStateRef.current = JSON.stringify({
        channelId: initialState.channelId,
        message: initialState.message,
        imagePosition: initialState.imagePosition,
        imageEmbedIndex: initialState.imageEmbedIndex,
      });
    }
  }, [store]);

  // Calculate current state string
  const currentStateStr = useMemo(
    () =>
      JSON.stringify({
        channelId: state.channelId,
        message: state.message,
        imagePosition: state.imagePosition,
        imageEmbedIndex: state.imageEmbedIndex,
      }),
    [
      state.channelId,
      state.message,
      state.imagePosition,
      state.imageEmbedIndex,
    ],
  );

  // Use state to track changes instead of ref comparison during render
  const [hasChanges, setHasChanges] = useState(false);

  // Detect changes in an effect
  useEffect(() => {
    if (lastSavedStateRef.current !== null) {
      setHasChanges(currentStateStr !== lastSavedStateRef.current);
    }
  }, [currentStateStr]);

  const reset = useStore(store, (state) => state.reset);

  // N'affiche pas le bouton s'il n'y a pas de changements
  if (!hasChanges) return null;

  return (
    <div className="fixed sm:w-3/5 w-4/5 flex justify-between bottom-5 z-50 left-0 right-0 mx-auto">
      <Card className="w-full shadow-lg">
        <CardBody className="flex w-full sm:flex-row flex-col items-center justify-between p-4 text-sm gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <p className="text-center">Careful, you have unsaved changes!</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                reset();
                // Reset to initial state
                const initialState = store.getInitialState();
                const resetStateStr = JSON.stringify({
                  channelId: initialState.channelId,
                  message: initialState.message,
                  imagePosition: initialState.imagePosition,
                  imageEmbedIndex: initialState.imageEmbedIndex,
                });
                lastSavedStateRef.current = resetStateStr;
                setHasChanges(false);
              }}
              disabled={isLoading}
              className="hover:text-foreground text-foreground/60 hover:underline transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={async () => {
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
                  console.error(error);
                  toast.error(error);
                } else if (done) {
                  toast.success("Settings updated successfully!");
                  // Update the last saved state
                  lastSavedStateRef.current = currentStateStr;
                  setHasChanges(false);
                }
                setIsLoading(false);
              }}
              className="flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
