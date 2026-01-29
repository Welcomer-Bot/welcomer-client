"use client";

import { SourceType } from "@/prisma/generated/client";
import { Button } from "@heroui/react";
import { redirect } from "next/navigation";

export default function ManageButton({
  guildId,
  module,
}: {
  guildId: string;
  module: SourceType;
}) {
  return (
    <Button
      color="primary"
      onPress={() =>
        redirect(`/dashboard/${guildId}/${module.slice(0, -1).toLowerCase()}`)
      }
    >
      Manage
    </Button>
  );
}
