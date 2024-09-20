"use client";

import { Button } from "@nextui-org/button";

import { LogoutIcon } from "@/components/icons";
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
