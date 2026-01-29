"use client";

import { updateCards } from "@/lib/actions";
import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { extractImageState } from "@/state/image";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);

  const store = useContext(ImageStoreContext);
  const sourceStore = useContext(SourceStoreContext);
  if (!sourceStore) throw new Error("Missing SourceStore.Provider in the tree");
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const guildId = useStore(sourceStore, (state) => state.guildId);
  const currentStore = useStore(store, (state) => state);
  const storeState = useStore(store);
  const data = extractImageState(storeState);
  const reset = useStore(store, (state) => state.reset);

  if (!currentStore) return null;
  if (currentStore.edited === false) return null;

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
            isLoading={isLoading}
            color="primary"
            onPress={async () => {
              setIsLoading(true);
              const {
                data: updatedData,
                done,
                error,
              } = await updateCards(data, guildId);
              if (error) {
                toast.error(error);
              } else if (done) {
                toast.success("Settings updated successfully !");
                store.setState((prevState) => ({
                  ...prevState,
                  ...updatedData,
                  removedCard: [],
                  removedText: [],
                  edited: false,
                }));
                console.log("updatedData", updatedData);
                sourceStore.setState((prevState) => ({
                  ...prevState,
                  ...updatedData,
                  edited: true,
                }));
              }
              setIsLoading(false);
            }}
          >
            Save changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
