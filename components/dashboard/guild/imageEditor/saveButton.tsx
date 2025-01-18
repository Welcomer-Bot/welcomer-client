"use client";

import { updateCards } from "@/lib/actions";
import { useImageStore } from "@/state/image";
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
            const res = await updateCards(store, module);
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
