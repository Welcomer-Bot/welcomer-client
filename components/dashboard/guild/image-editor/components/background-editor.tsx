import {Button} from "@heroui/button";
import {Card, CardBody, CardHeader} from "@heroui/card";
import {Input} from "@heroui/input";
import {Tab, Tabs} from "@heroui/tabs";

interface BackgroundEditorProps {
  backgroundColor: string | null | undefined;
  backgroundImgURL: string | null | undefined;
  onBackgroundColorChange: (color: string | null) => void;
  onBackgroundImgURLChange: (url: string | null) => void;
}

const GRADIENT_PRESETS = [
  {name: "Discord Dark", value: "#2c2f33"},
  {name: "Discord Darker", value: "#23272a"},
  {name: "Blurple", value: "#5865f2"},
  {name: "Ocean", value: "#1a5276"},
  {name: "Forest", value: "#1e4d2b"},
  {name: "Sunset", value: "#c0392b"},
  {name: "Midnight", value: "#1a1a2e"},
  {name: "Purple", value: "#4a235a"},
];

export function BackgroundEditor({
                                   backgroundColor,
                                   backgroundImgURL,
                                   onBackgroundColorChange,
                                   onBackgroundImgURLChange,
                                 }: BackgroundEditorProps) {
  const currentColor = backgroundColor || "#2c2f33";
  // Check if backgroundImgURL is not null (including empty string)
  const hasImage = backgroundImgURL !== null;
  return (
    <Card shadow="sm">
      <CardHeader className="pb-0 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-foreground">Background</h3>
        <div
          className="w-12 h-6 rounded border-2 border-default-200 shadow-sm"
          style={{
            backgroundColor: hasImage ? "transparent" : currentColor,
            backgroundImage: hasImage ? `url(${backgroundImgURL})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </CardHeader>
      <CardBody className="space-y-4 pt-4">
        <Tabs
          aria-label="Background type"
          color="primary"
          variant="bordered"
          selectedKey={hasImage ? "image" : "color"}
          onSelectionChange={(key) => {
            if (key === "image") {
              onBackgroundImgURLChange("");
            } else {
              onBackgroundImgURLChange(null);
              if (!backgroundColor) {
                onBackgroundColorChange("#2c2f33");
              }
            }
          }}
        >
          <Tab key="color" title="Solid Color">
            <div className="space-y-4 pt-4">
              {/* Preset colors */}
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => onBackgroundColorChange(preset.value)}
                    className={`h-12 rounded-lg border-2 transition-all hover:scale-105 flex items-end justify-center pb-1 ${
                      currentColor === preset.value
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-default-200"
                    }`}
                    style={{backgroundColor: preset.value}}
                    title={preset.name}
                  >
                    <span className="text-[10px] text-white/70 font-medium">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom color picker */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="h-10 w-20 rounded-lg cursor-pointer border-2 border-default-200"
                />
                <span className="text-sm text-default-500 font-mono">
                  {currentColor.toUpperCase()}
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  color="default"
                  onPress={() => onBackgroundColorChange("#2c2f33")}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Tab>
          <Tab key="image" title="Image URL">
            <div className="space-y-4 pt-4">
              <Input
                label="Background Image URL"
                placeholder="Default background used here"
                value={backgroundImgURL || ""}
                onValueChange={(value) =>
                  onBackgroundImgURLChange(value || null)
                }
                variant="bordered"
                labelPlacement="outside"
                isClearable
                onClear={() => onBackgroundImgURLChange(null)}
                description="Enter a valid image URL (PNG, JPG). Leave empty to use the default background."
                startContent={
                  <svg
                    className="w-4 h-4 text-default-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                }
              />

              {backgroundImgURL && (
                <div className="relative rounded-lg overflow-hidden border-2 border-default-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={backgroundImgURL}
                    alt="Background preview"
                    id="card-bg"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
