"use client";

import { Button } from "@heroui/button";
import { FiImage, FiPlus } from "react-icons/fi";

/** Shown while the module has no image card yet. */
export function CardEmptyState({
  isCreating,
  onCreate,
}: {
  isCreating: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 px-4 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-default-100">
        <FiImage aria-hidden className="h-8 w-8 text-default-400" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium">No image card</h3>
        <p className="max-w-sm text-default-500">
          Create an image card to display a custom welcome or leave image for
          your members.
        </p>
      </div>
      <Button
        color="primary"
        isLoading={isCreating}
        onPress={onCreate}
        startContent={!isCreating && <FiPlus aria-hidden />}
      >
        Create image card
      </Button>
    </div>
  );
}
