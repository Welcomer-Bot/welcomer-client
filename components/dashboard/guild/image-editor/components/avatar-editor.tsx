import { Card, CardBody, CardHeader } from "@heroui/card";

interface AvatarEditorProps {
  avatarBorderColor: string | null | undefined;
  onAvatarBorderColorChange: (color: string | null) => void;
}

export function AvatarEditor({
  avatarBorderColor,
  onAvatarBorderColorChange,
}: AvatarEditorProps) {
  return (
    <Card shadow="sm">
      <CardHeader className="pb-0">
        <h3 className="font-semibold text-lg text-foreground">Avatar</h3>
      </CardHeader>
      <CardBody className="space-y-3 pt-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Avatar Border Color
          </label>
          <input
            type="color"
            value={avatarBorderColor || "#7289da"}
            onChange={(e) => onAvatarBorderColorChange(e.target.value)}
            className="h-12 w-full rounded-lg cursor-pointer border-2 border-default-200"
          />
        </div>
      </CardBody>
    </Card>
  );
}
