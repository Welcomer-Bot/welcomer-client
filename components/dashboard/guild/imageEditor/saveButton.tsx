"use client";

import { updateCards } from "@/lib/actions";
import { ImageStore, useImageStore } from "@/state/image";
import { useModuleNameStore } from "@/state/moduleName";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { toast } from "react-toastify";

export default function SaveButton() {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = useImageStore();
  if (!store) return null;
  if (store.edited === false) return null;
  return (
    <Card className="fixed bottom-5">
      <CardBody>
        <Button
          color="primary"
          onPress={async () => {
            const storeWithoutPreview: Partial<ImageStore> = {
              moduleId: store.moduleId,
              activeCard: store.activeCard,
              removedCard: store.removedCard,
              removedText: store.removedText,
              imageCards: store.imageCards.map((card) => {
                const { imagePreview, ...rest } = card;
                return rest;
              }),
            }
            const res = await updateCards(storeWithoutPreview, module);
            if (res?.error) {
              toast.error(res.error);
            } else if (res.done) {
              toast.success("Settings updated successfully !");
            }
          }}
        >
          Save changes
        </Button>
      </CardBody>
    </Card>
  );
}
