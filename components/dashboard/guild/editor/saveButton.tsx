"use client";

import { updateWelcomer } from "@/lib/actions";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { toast } from "react-toastify";

export default function SaveButton() {
  const store = useWelcomerStore((state) => state);
  return (
    <Card className="fixed bottom-5">
      <CardBody>
        <Button
          color="primary"
          onPress={async () => {
            const res = await updateWelcomer(store);
            if (res?.error) {
              toast.error(res.error);
            } else if (res.done) {
              toast.success("Welcomer settings updated");
            }
          }}
        >
          Save changes
        </Button>
      </CardBody>
    </Card>
  );
}
