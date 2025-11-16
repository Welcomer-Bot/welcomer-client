import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

interface PreviewProps {
  card: string | null;
  isLoading: boolean;
  error: string | null;
}

export function Preview({ card, isLoading, error }: PreviewProps) {
  return (
    <Card className="sticky top-4" shadow="sm">
      <CardBody className="p-6">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Preview</h3>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Spinner
              size="lg"
              color="primary"
              label="Generating preview..."
              labelColor="foreground"
            />
          </div>
        )}

        {error && !isLoading && (
          <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
            <p className="text-danger font-semibold mb-1">Error</p>
            <p className="text-sm text-danger-600 dark:text-danger-400">
              {error}
            </p>
          </div>
        )}

        {card && !isLoading && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card}
              crossOrigin="anonymous"
              alt="Generated Card Preview"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {!card && !isLoading && !error && (
          <div className="flex items-center justify-center h-64 text-default-400">
            <p>No preview available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
