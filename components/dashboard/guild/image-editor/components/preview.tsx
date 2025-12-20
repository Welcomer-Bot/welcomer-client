import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

interface PreviewProps {
  card: string | null;
  isLoading: boolean;
  error: string | null;
}

export function Preview({ card, isLoading, error }: PreviewProps) {
  return (
    <Card className="sticky top-4" shadow="md">
      <CardHeader className="pb-2 border-b border-default-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h3 className="font-semibold text-lg text-foreground">
            Live Preview
          </h3>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 bg-default-50 rounded-lg">
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
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-danger font-semibold">Preview Error</p>
            </div>
            <p className="text-sm text-danger-600 dark:text-danger-400">
              {error}
            </p>
          </div>
        )}

        {card && !isLoading && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-default-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card}
                crossOrigin="anonymous"
                alt="Generated Card Preview"
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-center text-default-400">
              This is how your image card will appear
            </p>
          </div>
        )}

        {!card && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-64 text-default-400 bg-default-50 rounded-lg">
            <svg
              className="w-12 h-12 mb-3 text-default-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="font-medium">No preview available</p>
            <p className="text-sm text-default-300">
              Configure your card to see the preview
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
