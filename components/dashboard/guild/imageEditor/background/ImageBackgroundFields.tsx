import { ImageBackgroundColorInput } from "./ImageBackgroundColorInput";
import { ImageBackgroundUrlInput } from "./ImageBackgroundUrlInput";

export function ImageBackgroundFields() {
    return (
        <div className="space-y-3">
        <ImageBackgroundColorInput />
        <ImageBackgroundUrlInput />
        </div>
    );
}