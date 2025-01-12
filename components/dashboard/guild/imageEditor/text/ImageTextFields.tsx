import { ImageColorInput } from "./ImageColorInput";
import { ImageContentInput } from "./ImageContentInput";
import { ImageFontInput } from "./ImageFontInput";

export function ImageTextFields({ textType }: { textType: "mainText" | "secondText" }) {
  return (
    <div className="space-y-3">
          <ImageContentInput textType={textType} />
          <ImageColorInput textType={textType} />
          <ImageFontInput textType={textType} />
    </div>
  );
}
