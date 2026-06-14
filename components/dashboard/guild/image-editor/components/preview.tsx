"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { useState } from "react";

import { useImageEditor } from "../hooks/use-image-editor";
import { BaseCardConfig, CANVAS_HEIGHT, CANVAS_WIDTH } from "../types";

interface PreviewProps {
  guildId: string;
  config: BaseCardConfig | null;
}

export function Preview({ guildId, config }: Readonly<PreviewProps>) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { isLoading, error } = useImageEditor(canvas, guildId, config);

  return (
    <Card className="sticky top-4" shadow="md">
      <CardHeader className="pb-2 border-b border-default-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading ? "bg-warning animate-pulse" : "bg-success"
            }`}
          />
          <h3 className="font-semibold text-lg text-foreground">
            Live Preview
          </h3>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <canvas
          ref={setCanvas}
          className={`w-full h-auto transition-opacity ${
            isLoading || error ? "opacity-50" : "opacity-100"
          }`}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
        {error && (
          <p className="text-danger text-sm mt-2">{error}</p>
        )}
      </CardBody>
    </Card>
  );
}
