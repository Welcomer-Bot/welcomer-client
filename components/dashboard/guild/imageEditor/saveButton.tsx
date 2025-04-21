"use client";

import { updateCards } from "@/lib/actions";
import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { extractImageState } from "@/state/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
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

  if (!currentStore) return null;
  if (currentStore.edited === false) return null;

  return (
    <div className="absolute lg:w-1/2 w-3/4 lg:right-0 bottom-5 z-50 left-1/2 transform -translate-x-1/2 lg:translate-x-0">
      <Card>
        <CardBody>
          <Button
            isLoading={isLoading}
            color="primary"
            onPress={async () => {
              setIsLoading(true);
              const { done, error, data: res } = await updateCards(data, guildId);
              if (error) {
                toast.error(error);
              } else if (done) {
                store.setState(() => ({
                  ...res,
                  edited: false,
                }));
                toast.success("Settings updated successfully !");
              }
              setIsLoading(false);
            }}
          >
            Save changes
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
