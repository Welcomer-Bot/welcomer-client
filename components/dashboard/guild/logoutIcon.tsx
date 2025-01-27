import { Button } from "@heroui/button";

import { LogoutIcon as Icon } from "@/components/icons";
import { signOut } from "@/lib/actions";

export function LogoutIcon() {
  return (
    <form action={signOut}>
      <Button isIconOnly color="danger" type="submit" variant="ghost">
        <Icon />
      </Button>
    </form>
  );
}
