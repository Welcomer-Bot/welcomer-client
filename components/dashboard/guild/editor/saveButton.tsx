"use client";

import { updateSource } from "@/lib/actions";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { extractSourceState } from "@/state/source";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "zustand";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const edited = useStore(store, (state) => state.edited);
  const storeState = useStore(store);
  const data = extractSourceState(storeState);

  if (!edited) return null;
  return (
    <Card
      className={`fixed lg:w-1/2 w-3/4 lg:right-0 bottom-5 z-50 left-1/2 transform -translate-x-1/2 lg:translate-x-0`}
    >
      <CardBody>
        <Button
          color="primary"
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            const {data: updatedData , done, error} = await updateSource(data);
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
                        (embed) => embed.id === updatedData.activeCardToEmbedId
                      )
                    : undefined,
                edited: false,
                deletedEmbeds: [],
                deletedFields: [],
              }));
            }
            setIsLoading(false);
          }}
        >
          Save changes
        </Button>
      </CardBody>
    </Card>
  );
}
