import { Button } from "@heroui/react";

import { LogoutIcon } from "@/components/shared/icons";
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
