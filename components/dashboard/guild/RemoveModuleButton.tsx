"use client";
import { removeSource } from "@/lib/actions";
import { Button } from "@heroui/react";
import { SourceType } from "@prisma/client";
import { usePlausible } from "next-plausible";
import { useState } from "react";

export default function RemoveModuleButton({
  guildId,
  sourceId,
  sourceType,
}: {
  guildId: string;
  sourceId: number;
  sourceType: SourceType;
}) {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();
  return (
    <Button
      color="danger"
      variant="ghost"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        plausible("RemoveModuleButton", {
          props: {
            sourceType,
          },
        });
        await removeSource(guildId, sourceId, sourceType);
      }}
    >
      Disable {sourceType}
    </Button>
  );
}
