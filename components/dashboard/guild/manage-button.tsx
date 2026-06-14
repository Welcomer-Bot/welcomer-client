"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { SourceType } from "@/generated/prisma/enums";
import { getDashboardModuleBySourceType } from "@/features/dashboard/modules/config";

export default function ManageButton({
  guildId,
  module,
}: {
  guildId: string;
  module: SourceType;
}) {
  const moduleConfig = getDashboardModuleBySourceType(module);
  const link = moduleConfig
    ? `/dashboard/${guildId}/${moduleConfig.slug}`
    : `/dashboard/${guildId}`;

  return (
    <Button as={Link} href={link} color="primary">
      Manage
    </Button>
  );
}
