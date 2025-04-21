"use client";
import { removeSource } from "@/lib/actions";
import { Button } from "@heroui/button";
import { SourceType } from "@prisma/client";


export default function RemoveModuleButton({
  guildId,
  sourceId,
  sourceType,
}: {
    guildId: string;
    sourceId: number;
    sourceType: SourceType;
}) {
  return (
    <Button
      color="danger"
      variant="ghost"
      onPress={() => removeSource(guildId, sourceId, sourceType)}
    >
      Disable {sourceType}
    </Button>
  );
}
