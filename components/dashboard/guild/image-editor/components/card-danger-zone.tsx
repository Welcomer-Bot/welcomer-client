"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { FiTrash2 } from "react-icons/fi";

/**
 * Deleting the card sits at the bottom, away from the fields it would wipe —
 * it used to be the first control in the form.
 */
export function CardDangerZone({
  isDeleting,
  isDisabled,
  onDelete,
}: {
  isDeleting: boolean;
  isDisabled: boolean;
  onDelete: () => void;
}) {
  return (
    <Card className="border border-danger-200 bg-danger-50/50" shadow="none">
      <CardBody className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-danger">Delete this image card</p>
          <p className="text-small text-default-500">
            The card and its settings are removed for good.
          </p>
        </div>
        <Button
          color="danger"
          isDisabled={isDisabled}
          isLoading={isDeleting}
          onPress={onDelete}
          size="sm"
          startContent={!isDeleting && <FiTrash2 aria-hidden />}
          variant="flat"
        >
          Delete card
        </Button>
      </CardBody>
    </Card>
  );
}
