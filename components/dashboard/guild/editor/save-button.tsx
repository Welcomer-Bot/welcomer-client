"use client";

import { updateSource } from "@/lib/actions";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const state = useStore(store, (state) => state);

  // Détecte s'il y a des modifications en comparant avec l'état initial
  const hasChanges = useStore(store, (state) => {
    const initialState = store.getInitialState();
    return (
      state.channelId !== initialState.channelId ||
      JSON.stringify(state.message) !== JSON.stringify(initialState.message) ||
      state.imagePosition !== initialState.imagePosition ||
      state.imageEmbedIndex !== initialState.imageEmbedIndex
    );
  });

  console.log("new state", state);

  const reset = useStore(store, (state) => state.reset);

  // N'affiche pas le bouton s'il n'y a pas de changements
  if (!hasChanges) return null;
  return (
    <div
      className={`fixed sm:w-3/5 w-4/5 flex justify-between bottom-5 z-50 left-0 right-0 mx-auto`}
    >
      <Card className="w-full">
        <CardBody className="flex w-full sm:flex-row items-center justify-between p-5 text-sm space-x-4">
          <p className="text-center">Careful, you have unsaved changes!</p>
          <div className="sm:mt-0 mt-2 flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                reset();
              }}
              className="hover:decoration-white hover:underline"
            >
              Reset
            </button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={async () => {
                setIsLoading(true);
                const {
                  data: updatedData,
                  done,
                  error,
                } = await updateSource({
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
                  toast.success("Settings updated successfully !");
                  store.setState((prevState) => ({
                    ...prevState,
                    ...updatedData,
                  }));
                }
                setIsLoading(false);
              }}
              className="flex items-center justify-center space-x-2"
            >
              <p>Save changes</p>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
