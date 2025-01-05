"use client";
import { Button } from "@nextui-org/button";

import { createModule } from "@/lib/actions";
import { ModuleName } from "@/types";

export default function EnableModuleButton({
  guildId,
  moduleName,
}: {
  guildId: string;
  moduleName: ModuleName;
}) {
  return (
    <Button color="primary" onPress={() => createModule(guildId, moduleName)}>
      Enable {moduleName}
    </Button>
  );
}
