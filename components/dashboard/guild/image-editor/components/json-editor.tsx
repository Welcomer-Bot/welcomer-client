import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import { BaseCardConfig } from "../types";

interface JsonEditorProps {
  config: BaseCardConfig;
  onImport: (config: BaseCardConfig) => void;
}

export function JsonEditor({ config, onImport }: JsonEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    const json = JSON.stringify(config, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImport(parsed);
      setJsonError(null);
      setJsonText("");
      setIsExpanded(false);
    } catch (error) {
      setJsonError(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  };

  return (
    <Card shadow="sm">
      <CardBody className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground">
              JSON Configuration
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleExport}
              >
                {copied ? "✓ Copied!" : "Export to Clipboard"}
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="flat"
                onPress={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide" : "Show"} Import
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-3">
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                placeholder="Paste JSON configuration here..."
                className="w-full min-h-[200px] p-3 border-2 border-default-200 rounded-lg font-mono text-sm bg-default-50 focus:outline-none focus:border-primary"
              />

              {jsonError && (
                <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                  <p className="text-sm text-danger-600 dark:text-danger-400">
                    <strong>Error:</strong> {jsonError}
                  </p>
                </div>
              )}

              <Button
                size="sm"
                color="success"
                onPress={handleImport}
                isDisabled={!jsonText.trim()}
              >
                Import Configuration
              </Button>
            </div>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors">
              View Current Configuration
            </summary>
            <pre className="mt-3 p-4 bg-default-100 dark:bg-default-50/10 rounded-lg overflow-auto text-xs border border-default-200">
              {JSON.stringify(config, null, 2)}
            </pre>
          </details>
        </div>
      </CardBody>
    </Card>
  );
}
