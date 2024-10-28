"use client";

import { Button } from "@nextui-org/button";

export function addFieldButton({ embedId }: { embedId: number }) {
  return (
    <Button
      className="sm:mr-4 sm:mb-0 mb-2"
      color="primary"
      onClick={() => addField(embedId)}
    >
      Add Field
    </Button>
  );
}
