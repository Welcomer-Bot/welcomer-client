"use client";

import { updateModule } from "@/lib/actions";
import { useLeaverStore } from "@/state/leaver";
import { useModuleNameStore } from "@/state/moduleName";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SaveButton() {
  const module = useModuleNameStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (store.edited) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [store.edited]);
  if (!visible) return null;
  return (
    <Card className={`absolute w-1/2 right-0 bottom-5`}>
      <CardBody>
        <Button
          color="primary"
          onPress={async () => {
            const res = await updateModule(store, module);
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
