"use client";

import { updateModule } from "@/lib/actions";
import { useLeaverStore } from "@/state/leaver";
import { useModuleStore } from "@/state/module";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { toast } from "react-toastify";

export default function SaveButton() {
  const module = useModuleStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();
  return (
    <Card className="fixed bottom-5">
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
