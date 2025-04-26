"use client";
import { createSource } from "@/lib/actions";
import { Button } from "@heroui/button";
import { SourceType } from "@prisma/client";
import { usePlausible } from "next-plausible";
import { useState } from "react";

export default function EnableModuleButton({
  guildId,
  sourceType,
}: {
  guildId: string;
  sourceType: SourceType;
}) {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible();
  return (
    <Button
      color="primary"
      isLoading={loading}
      onPress={async () => {
        setLoading(true);
        plausible("EnableModuleButton", {
          props: {
            sourceType,
          },
        });
        await createSource(guildId, sourceType);
      }}
    >
      Enable {sourceType}
    </Button>
  );
}
