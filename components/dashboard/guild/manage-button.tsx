"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { SourceType } from "../../../generated/prisma/browser";

export default function ManageButton({
  guildId,
  module,
}: {
  guildId: string;
  module: SourceType;
}) {
  const link = `/dashboard/${guildId}/${module.slice(0, -1).toLowerCase()}`;

  return (
    <Button as={Link} href={link} color="primary">
      Manage
    </Button>
  );
}
