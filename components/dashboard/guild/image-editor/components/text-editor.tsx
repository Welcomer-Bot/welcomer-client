import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { FONT_OPTIONS, FONT_WEIGHT_OPTIONS, TextCard } from "../types";

interface TextEditorProps {
  label: string;
  text: TextCard | null | undefined;
  onChange: (text: TextCard | null) => void;
  placeholder?: string;
}

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
      <CardHeader className="pb-0">
        <h3 className="font-semibold text-lg text-foreground">{label}</h3>
      </CardHeader>
      <CardBody className="space-y-3 pt-4">
        <Input
          label="Content"
          placeholder={placeholder || "Enter text..."}
          value={currentText.content}
          onValueChange={(value) => handleChange("content", value)}
          variant="bordered"
          labelPlacement="outside"
          description="Use {user.username}, {guild.name}, etc."
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <input
              type="color"
              value={currentText.color || "#ffffff"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="h-10 w-full rounded-lg cursor-pointer border-2 border-default-200"
            />
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
