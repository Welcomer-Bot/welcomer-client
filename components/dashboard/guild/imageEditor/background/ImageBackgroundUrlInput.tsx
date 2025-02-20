import { useImageStore } from "@/state/image";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { useEffect, useState } from "react";

export function ImageBackgroundUrlInput() {
  const backgroundUrl = useImageStore(
    (state) => state.getActiveCard()!.backgroundImgURL
  );
  const setBackgroundUrl = useImageStore((state) => state.setBackgroundUrl);
  const [enabled, setEnabled] = useState<boolean>(typeof backgroundUrl === "string");

  useEffect(() => {
    if (!enabled) {
      setBackgroundUrl(null);
    } else {
      setBackgroundUrl(" ");
    }
  }, [enabled, setBackgroundUrl]);

  useEffect(() => {
    if (backgroundUrl === null) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [backgroundUrl]);
  return (
    <>
      <Switch isSelected={enabled} onValueChange={setEnabled}>
        Enable background image
      </Switch>
      {enabled && (
        <Input
          type="url"
          label="Background URL"
          aria-label="Background URL"
          value={backgroundUrl ?? ""}
          onValueChange={(value) => setBackgroundUrl(value)}
          isClearable
        />
      )}
    </>
  );
}
