"use client";

import { updateImageCard } from "@/lib/actions";
import {
  ImageCardStoreContext,
  useImageCardStore,
} from "@/providers/imageCardStoreProvider";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

interface SaveButtonProps {
  guildId: string;
}

export function SaveButton({ guildId }: SaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(ImageCardStoreContext);

  // Track the last saved state to compare against
  const lastSavedDataRef = useRef<string | null>(null);

  if (!store) throw new Error("Missing ImageCardStoreProvider in the tree");

  const state = useStore(store, (state) => state);
  const reset = useImageCardStore((state) => state.reset);

  // Initialize the last saved data ref on first render
  if (lastSavedDataRef.current === null) {
    lastSavedDataRef.current = JSON.stringify(store.getInitialState().data);
  }

  // Détecte s'il y a des modifications en comparant avec l'état sauvegardé
  const currentDataStr = JSON.stringify(state.data);
  const hasChanges = currentDataStr !== lastSavedDataRef.current;

  // N'affiche pas le bouton s'il n'y a pas de changements ou pas de card
  if (!hasChanges || !state.id) return null;

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
                // Reset to initial state means we go back to the saved state
                lastSavedDataRef.current = JSON.stringify(
                  store.getInitialState().data,
                );
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
                    console.error(error);
                    toast.error(error);
                  } else if (done && updatedData) {
                    toast.success("Settings updated successfully!");
                    // Update the last saved data to current data
                    lastSavedDataRef.current = JSON.stringify(state.data);
                  }
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "An error occurred",
                  );
                } finally {
                  setIsLoading(false);
                }
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
