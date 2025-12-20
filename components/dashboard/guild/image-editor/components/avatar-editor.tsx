import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface AvatarEditorProps {
  avatarBorderColor: string | null | undefined;
  onAvatarBorderColorChange: (color: string | null) => void;
}

const PRESET_COLORS = [
  "#7289da", // Discord Blurple
  "#ffffff", // White
  "#43b581", // Discord Green
  "#f04747", // Discord Red
  "#faa61a", // Discord Yellow
  "#9b59b6", // Purple
  "#3498db", // Blue
  "#2c2f33", // Dark
];

export function AvatarEditor({
  avatarBorderColor,
  onAvatarBorderColorChange,
}: AvatarEditorProps) {
  const currentColor = avatarBorderColor || "#7289da";

  return (
    <Card shadow="sm">
      <CardHeader className="pb-0 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-foreground">Avatar</h3>
        <div
          className="w-6 h-6 rounded-full border-2 border-default-200 shadow-sm"
          style={{ backgroundColor: currentColor }}
        />
      </CardHeader>
      <CardBody className="space-y-4 pt-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">
            Border Color
          </label>

          {/* Preset colors */}
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onAvatarBorderColorChange(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  currentColor === color
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-default-200"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Custom color picker */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onAvatarBorderColorChange(e.target.value)}
              className="h-10 w-20 rounded-lg cursor-pointer border-2 border-default-200"
            />
            <span className="text-sm text-default-500 font-mono">
              {currentColor.toUpperCase()}
            </span>
            <Button
              size="sm"
              variant="flat"
              color="default"
              onPress={() => onAvatarBorderColorChange("#7289da")}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4 p-4 bg-default-100 rounded-lg">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{
              border: `4px solid ${currentColor}`,
              backgroundColor: "#2c2f33",
            }}
          >
            <svg
              className="w-8 h-8 text-default-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="text-sm text-default-500">Avatar border preview</div>
        </div>
      </CardBody>
    </Card>
  );
}
