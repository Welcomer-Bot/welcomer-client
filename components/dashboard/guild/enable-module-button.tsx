"use client";
import { createSource } from "@/lib/actions";
import { SourceType } from "@/prisma/generated/client";
import { Button } from "@heroui/react";
import { usePlausible } from "next-plausible";
import { useState } from "react";
import { toast } from "react-toastify";

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
        try {
          await createSource(guildId, sourceType);
        } catch (e) {
          setLoading(false);
          console.log("error", e);
          if (e instanceof Error) {
            toast.error(e.message || "An error occurred");
          } else {
            toast.error("An error occurred");
          }
          // toast.error("An error occured while creating the source" as string);
        }
      }}
    >
      Enable {sourceType}
    </Button>
  );
}
