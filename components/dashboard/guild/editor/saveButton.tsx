"use client";

import { updateSource } from "@/lib/actions";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { extractSourceState } from "@/state/source";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const edited = useStore(store, (state) => state.edited);
  const reset = useStore(store, (state) => state.reset);
  const storeState = useStore(store);
  const data = extractSourceState(storeState);

  if (!edited) return null;
  return (
    <div
      className={`fixed sm:w-3/5 w-4/5 flex justify-between bottom-5 z-50 left-0 right-0 mx-auto`}
    >
      <Card className="w-full">
        <CardBody className="flex w-full sm:flex-row items-center justify-between p-5 text-sm space-x-2">
          <p className="text-center">Careful, you have unsaved changes!</p>
          <div className="sm:mt-0 mt-2 flex items-center justify-center space-x-2">
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
                } = await updateSource(data);
                if (error) {
                  console.error(error);
                  toast.error(error);
                } else if (done) {
                  toast.success("Settings updated successfully !");
                  store.setState((prevState) => ({
                    ...prevState,
                    ...updatedData,
                    activeCardToEmbedId:
                      updatedData.activeCardToEmbedId !== undefined
                        ? updatedData.embeds.findIndex(
                            (embed) =>
                              embed.id === updatedData.activeCardToEmbedId
                          )
                        : undefined,
                    edited: false,
                    deletedEmbeds: [],
                    deletedFields: [],
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
