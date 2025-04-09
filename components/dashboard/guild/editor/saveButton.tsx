"use client";

import { updateModule } from "@/lib/actions";
import { useLeaverStore } from "@/state/leaver";
import { useWelcomerStore } from "@/state/welcomer";
import { ModuleName } from "@/types";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SaveButton({ module }: { module: ModuleName }) {
  const [isLoading, setIsLoading] = useState(false);
  const welcomerStore = useWelcomerStore();
  const leaverStore = useLeaverStore();
  const store = module === "welcomer" ? welcomerStore : leaverStore;

  if (!store.edited) return null;
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
            const res = await updateModule(store.toObject(), module);
            if (res?.error) {
              toast.error(res.error);
            } else if (res.done) {
              toast.success("Settings updated successfully !");
              store.setEdited(false);
              // reset();
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
