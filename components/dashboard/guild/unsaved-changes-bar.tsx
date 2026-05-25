"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

interface UnsavedChangesBarProps {
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function UnsavedChangesBar({
  isLoading,
  onReset,
  onSave,
}: UnsavedChangesBarProps) {
  return (
    <div className="fixed sm:w-3/5 w-4/5 flex justify-between bottom-5 z-50 left-0 right-0 mx-auto">
      <Card className="w-full shadow-lg">
        <CardBody className="flex w-full sm:flex-row flex-col items-center justify-between p-4 text-sm gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <p className="text-center">Careful, you have unsaved changes!</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onReset}
              disabled={isLoading}
              className="hover:text-foreground text-foreground/60 hover:underline transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={onSave}
              className="flex items-center justify-center gap-2"
            >
              Save changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
