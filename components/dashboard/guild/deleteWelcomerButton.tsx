"use client";
import { Button } from "@nextui-org/button";

import { removeWelcomer } from "@/lib/actions";

export default function RemoveWelcomerButton({ guildId }: { guildId: string }) {
  return (
    <Button
      color="danger"
      variant="ghost"
      onClick={() => removeWelcomer(guildId)}
    >
      Disable Welcomer
    </Button>
  );
}
