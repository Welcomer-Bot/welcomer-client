"use client";
import { Button } from "@nextui-org/button";

import { removeModule } from "@/lib/actions";
import { ModuleName } from "@/types";

export default function RemoveModuleButton({
  guildId,
  moduleName,
}: {
  guildId: string;
  moduleName: ModuleName;
}) {
  return (
    <Button
      color="danger"
      variant="ghost"
      onPress={() => removeModule(guildId, moduleName)}
    >
      Disable {moduleName}
    </Button>
  );
}
