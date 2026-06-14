import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { variableHints } from "@welcomer-bot/utils";
import {
  VariableHintsRow,
} from "@/components/dashboard/guild/variable-hints-row";
import {
  FONT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  TEXT_DEFAULTS,
  TEXT_SIZE_MAX,
  TEXT_SIZE_MIN,
  TextCard,
} from "../types";

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
  const currentText = text || TEXT_DEFAULTS;

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
          <VariableHintsRow
            hints={variableHints.filter((h) => h.variable !== "{user}")}
            onAppend={(variable) =>
              handleChange("content", currentText.content + variable)
            }
          />
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
            min={TEXT_SIZE_MIN}
            max={TEXT_SIZE_MAX}
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
