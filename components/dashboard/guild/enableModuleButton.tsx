"use client";
import { createSource } from "@/lib/actions";
import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Button } from "@heroui/react";
import { SourceType } from "@prisma/client";
import { usePlausible } from "next-plausible";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export default function EnableModuleButton({
  guildId,
  sourceType,
}: {
  guildId: string;
  sourceType: SourceType;
}) {
  const store = useContext(SourceStoreContext);

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
          store?.setState((prev) => ({
            ...prev,
            edited: true,
          }));
        } catch (e) {
          toast.error(e as string);
        }
      }}
    >
      Enable {sourceType}
    </Button>
  );
}
