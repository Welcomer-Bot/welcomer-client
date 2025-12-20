import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tooltip } from "@heroui/tooltip";
import { FONT_OPTIONS, FONT_WEIGHT_OPTIONS, TextCard } from "../types";

interface TextEditorProps {
  label: string;
  text: TextCard | null | undefined;
  onChange: (text: TextCard | null) => void;
  placeholder?: string;
}

const VARIABLE_HINTS = [
  { variable: "{user.username}", description: "Username" },
  { variable: "{user.displayName}", description: "Display name" },
  { variable: "{user.mention}", description: "User mention" },
  { variable: "{guild.name}", description: "Server name" },
  { variable: "{guild.memberCount}", description: "Member count" },
];

export function TextEditor({
  label,
  text,
  onChange,
  placeholder,
}: TextEditorProps) {
  const currentText = text || {
    content: "",
    color: "#ffffff",
    font: "Arial",
    size: 24,
    weight: "normal",
  };

  const handleChange = (field: keyof TextCard, value: string | number) => {
    onChange({
      ...currentText,
      [field]: value,
    });
  };

  return (
    <Card shadow="sm">
      <CardHeader className="pb-0 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-foreground">{label}</h3>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded border border-default-200"
            style={{ backgroundColor: currentText.color || "#ffffff" }}
          />
          <span className="text-xs text-default-400">
            {currentText.size || 24}px
          </span>
        </div>
      </CardHeader>
      <CardBody className="space-y-4 pt-4">
        <div className="space-y-2">
          <Input
            label="Content"
            placeholder={placeholder || "Enter text..."}
            value={currentText.content}
            onValueChange={(value) => handleChange("content", value)}
            variant="bordered"
            labelPlacement="outside"
          />
          {/* Variable hints */}
          <div className="flex flex-wrap gap-1.5">
            {VARIABLE_HINTS.map((hint) => (
              <Tooltip key={hint.variable} content={hint.description}>
                <button
                  type="button"
                  onClick={() => {
                    handleChange(
                      "content",
                      currentText.content + hint.variable,
                    );
                  }}
                  className="text-xs px-2 py-1 rounded-full bg-default-100 hover:bg-primary/20 hover:text-primary transition-colors font-mono"
                >
                  {hint.variable}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentText.color || "#ffffff"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="h-10 w-14 rounded-lg cursor-pointer border-2 border-default-200"
              />
              <span className="text-xs text-default-500 font-mono">
                {(currentText.color || "#ffffff").toUpperCase()}
              </span>
            </div>
          </div>

          <Input
            label="Size"
            type="number"
            value={currentText.size?.toString() || "24"}
            onValueChange={(value) =>
              handleChange("size", parseInt(value) || 24)
            }
            variant="bordered"
            labelPlacement="outside"
            min={8}
            max={200}
            endContent={<span className="text-sm text-default-400">px</span>}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Font"
            selectedKeys={[currentText.font || "Arial"]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange("font", value);
            }}
            variant="bordered"
            labelPlacement="outside"
          >
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font}>{font}</SelectItem>
            ))}
          </Select>

          <Select
            label="Weight"
            selectedKeys={[currentText.weight || "normal"]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange("weight", value);
            }}
            variant="bordered"
            labelPlacement="outside"
          >
            {FONT_WEIGHT_OPTIONS.map((weight) => (
              <SelectItem key={weight}>{weight}</SelectItem>
            ))}
          </Select>
        </div>
      </CardBody>
    </Card>
  );
}
