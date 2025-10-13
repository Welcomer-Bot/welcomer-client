import { Card, CardBody } from "@heroui/card";

export function Editor({ module }: { module: string }) {
  return (
    <Card>
      <CardBody>
        <p>Image Editor for {module} - Coming Soon</p>
        <p className="text-sm text-gray-500 mt-2">
          This feature is currently under development.
        </p>
      </CardBody>
    </Card>
  );
}
