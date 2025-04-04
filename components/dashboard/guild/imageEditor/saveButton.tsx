"use client";

import { updateCards } from "@/lib/actions";
import { ImageStore, useImageStore } from "@/state/image";
import { useModuleNameStore } from "@/state/moduleName";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  const currentModuleName = useModuleNameStore((state) => state.moduleName);
  const reset = useImageStore((state) => state.reset);
  const currentStore = useImageStore();
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
              const storeWithoutPreview: Partial<ImageStore> = {
                moduleId: currentStore.moduleId,
                activeCard: currentStore.activeCard,
                removedCard: currentStore.removedCard,
                removedText: currentStore.removedText,
                imageCards: currentStore.imageCards.map(
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  ({ imagePreview, ...rest }) => rest
                ),
              };
              const { done, error } = await updateCards(
                storeWithoutPreview,
                currentModuleName
              );
              if (error) {
                toast.error(error);
              } else if (done) {
                toast.success("Settings updated successfully !");
                reset();
              }
              // if (store) {
              //   useImageStore.setState((state) => {
              //     state.imageCards = store.imageCards || [];
              //   });
              // }
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
