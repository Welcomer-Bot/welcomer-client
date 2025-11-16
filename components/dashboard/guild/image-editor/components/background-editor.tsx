import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { useState } from "react";

interface BackgroundEditorProps {
  backgroundColor: string | null | undefined;
  backgroundImgURL: string | null | undefined;
  onBackgroundColorChange: (color: string | null) => void;
  onBackgroundImgURLChange: (url: string | null) => void;
}

export function BackgroundEditor({
  backgroundColor,
  backgroundImgURL,
  onBackgroundColorChange,
  onBackgroundImgURLChange,
}: BackgroundEditorProps) {
  const [useImage, setUseImage] = useState(!!backgroundImgURL);

  const handleToggleImageMode = (checked: boolean) => {
    setUseImage(checked);
    if (!checked) {
      onBackgroundImgURLChange(null);
      onBackgroundColorChange("");
    } else {
      onBackgroundImgURLChange("");
    }
  };

  return (
    <Card shadow="sm">
      <CardHeader className="pb-0">
        <h3 className="font-semibold text-lg text-foreground">Background</h3>
      </CardHeader>
      <CardBody className="space-y-3 pt-4">
        <Switch
          isSelected={useImage}
          onValueChange={handleToggleImageMode}
          color="primary"
        >
          Use Background Image
        </Switch>

        {useImage ? (
          <Input
            label="Background Image URL"
            placeholder="https://example.com/image.png"
            value={backgroundImgURL || ""}
            onValueChange={(value) => onBackgroundImgURLChange(value || null)}
            variant="bordered"
            labelPlacement="outside"
            isClearable
            onClear={() => onBackgroundImgURLChange(null)}
            description="Enter a valid image URL"
          />
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Background Color
            </label>
            <input
              type="color"
              value={backgroundColor || "#2c2f33"}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="h-12 w-full rounded-lg cursor-pointer border-2 border-default-200"
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
