"use client";
import { removeSource } from "@/lib/actions";
import { Button } from "@heroui/button";
import { SourceType } from "@prisma/client";
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
  return (
    <Button
      color="danger"
      variant="ghost"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);

        await removeSource(guildId, sourceId, sourceType);
      }}
    >
      Disable {sourceType}
    </Button>
  );
}
