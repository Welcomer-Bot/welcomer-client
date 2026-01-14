"use client";

import {Card, CardBody, CardHeader} from "@heroui/card";
import {Skeleton} from "@heroui/skeleton";

interface PreviewProps {
  isLoading: boolean;
  error: string | null;
}

export function Preview({isLoading, error}: PreviewProps) {
  return (
    <Card className="sticky top-4" shadow="md">
      <CardHeader className="pb-2 border-b border-default-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"/>
          <h3 className="font-semibold text-lg text-foreground">
            Live Preview
          </h3>
        </div>
      </CardHeader>
      <CardBody className="p-4">

        {
          isLoading ?? (
            <Skeleton>
              <div className="flex justify-center items-center" style={{width: "800px", height: "300px"}}>
                Loading
              </div>
            </Skeleton>
          )
        }
        <canvas
          id="preview-canvas"
          className={`w-full h-auto ${(isLoading || error != null) ? "hidden" : "block"}`}
          width={800}
          height={350}
        ></canvas>
      </CardBody>
    </Card>
  );
}
