"use client";

import { Button } from "@heroui/button";

import { LogoutIcon } from "@/components/ui/icons/icons";
import { signOut } from "@/lib/actions";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button
        className="w-full transition-all"
        color="danger"
        startContent={<LogoutIcon />}
        type="submit"
        variant="ghost"
      >
        Logout
      </Button>
    </form>
  );
}
