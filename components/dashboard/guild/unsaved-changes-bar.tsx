"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

interface UnsavedChangesBarProps {
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
  /** When set, saving is blocked and this replaces the unsaved-changes notice. */
  error?: string | null;
}

export function UnsavedChangesBar({
                                    isLoading,
                                    onReset,
                                    onSave,
                                    error,
                                  }: UnsavedChangesBarProps) {
  return (
    <div className="sticky sm:w-4/5 w-3/5 flex justify-between bottom-5 z-50 left-0 right-0 mx-auto">
      <Card className="w-full shadow-lg">
        <CardBody className="flex w-full sm:flex-row flex-col items-center justify-between p-4 text-sm gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 shrink-0 rounded-full ${
                error ? "bg-danger" : "animate-pulse bg-warning"
              }`}
            />
            <p className="whitespace-pre-line text-center">
              {error ?? "Careful, you have unsaved changes!"}
            </p>
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
              isDisabled={!!error}
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
