"use client";

import { Button } from "@heroui/button";
import Link from "next/link";

/**
 * Exists only to keep `as={Link}` on the client: a server component cannot
 * hand a function prop to HeroUI's Button.
 */
export default function ManageButton({
  href,
  label = "Manage",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Button as={Link} color="primary" href={href} size="sm" variant="flat">
      {label}
    </Button>
  );
}
