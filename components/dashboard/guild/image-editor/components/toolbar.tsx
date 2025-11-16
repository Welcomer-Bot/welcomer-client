import { Button } from "@heroui/button";

interface ToolbarProps {
  onReset: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function Toolbar({ onReset, onSave, isSaving }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-default-100 dark:bg-default-50/10 rounded-lg border border-default-200">
      <div className="flex gap-2">
        <Button
          size="sm"
          color="warning"
          variant="flat"
          onPress={onReset}
          startContent={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        >
          Reset to Default
        </Button>
      </div>

      {onSave && (
        <Button
          size="sm"
          color="success"
          onPress={onSave}
          isLoading={isSaving}
          startContent={
            !isSaving ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : undefined
          }
        >
          Save Configuration
        </Button>
      )}
    </div>
  );
}
