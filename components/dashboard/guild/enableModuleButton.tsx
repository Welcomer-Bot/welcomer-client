"use client";
import { createSource } from "@/lib/actions";
import { Button } from "@heroui/button";
import { SourceType } from "@prisma/client";

export default function EnableModuleButton({
  guildId,
  sourceType,
}: {
  guildId: string;
  sourceType: SourceType;
}) {
  return (
    <Button
      color="primary"
      onPress={() => {
        createSource(guildId, sourceType);
      }}
    >
      Enable {sourceType}
    </Button>
  );
}
