import { ImageTextType } from "@/types";
import { ImageColorInput } from "./ImageColorInput";
import { ImageContentInput } from "./ImageContentInput";
import { ImageFontInput } from "./ImageFontInput";
import { ImageTextSwitch } from "./ImageTextSwitch";

export function ImageTextFields({ textType }: { textType: ImageTextType }) {
  return (
    <div className="space-y-3">
      <ImageTextSwitch textType={textType}>
        <ImageContentInput textType={textType} />
        <ImageColorInput textType={textType} />
        <ImageFontInput textType={textType} />
      </ImageTextSwitch>
    </div>
  );
}
