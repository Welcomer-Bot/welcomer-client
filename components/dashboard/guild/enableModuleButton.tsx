"use client";
import { createSource } from "@/lib/actions";
import { Button } from "@heroui/button";
import { SourceType } from "@prisma/client";
import { useState } from "react";

export default function EnableModuleButton({
  guildId,
  sourceType,
}: {
  guildId: string;
  sourceType: SourceType;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      color="primary"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        await createSource(guildId, sourceType);
      }}
    >
      Enable {sourceType}
    </Button>
  );
}
