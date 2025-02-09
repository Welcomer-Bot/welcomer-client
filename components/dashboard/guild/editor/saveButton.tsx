"use client";

import { updateModule } from "@/lib/actions";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { toast } from "react-toastify";

export default function SaveButton() {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  if (!store.edited) return null;
  return (
    <Card
      className={`absolute lg:w-1/2 w-3/4 lg:right-0 bottom-5 z-50 left-1/2 transform -translate-x-1/2 lg:translate-x-0`}
    >
      <CardBody>
        <Button
          color="primary"
          onPress={async () => {
            const res = await updateModule(store, module);
            if (res?.error) {
              toast.error(res.error);
            } else if (res.done) {
              toast.success("Settings updated successfully !");
              store.setEdited(false);
            }
          }}
        >
          Save changes
        </Button>
      </CardBody>
    </Card>
  );
}
