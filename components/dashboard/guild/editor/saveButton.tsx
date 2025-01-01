"use client";

import { updateWelcomer } from "@/lib/actions";
import { useWelcomerStore } from "@/state/welcomer";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

export default function SaveButton({ guildId }: { guildId: string }) {
  const store = useWelcomerStore((state) => state);

  return (
    <Card className="fixed bottom-5">
      <CardBody>
        <Button color="primary" onPress={() => updateWelcomer(store)}>
          Save changes
        </Button>
      </CardBody>
    </Card>
  );
}
