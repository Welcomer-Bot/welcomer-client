import { useImageStore } from "@/state/image";
import { Input } from "@nextui-org/input";

export function ImageBackgroundUrlInput() {
  const backgroundUrl = useImageStore((state) => state.getActiveCard()!.backgroundImgURL);
  const setBackgroundUrl = useImageStore((state) => state.setBackgroundUrl);

  return (
    <Input
      type="url"
      label="Background URL"
      aria-label="Background URL"
      value={backgroundUrl ?? ""}
      onValueChange={(value) => setBackgroundUrl(value)}
    />
  );
}