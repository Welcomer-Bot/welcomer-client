import { EditorImagePreview } from "./editorImagePreview";
import { ImageTextFields } from "./text/ImageTextFields";

export function Editor() {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-auto no-scrollbar">
          <form className="px-5 pt-5 pb-20 space-y-5 w-full relative">
            <ImageTextFields textType="mainText" />
            <ImageTextFields textType="secondText" />
          </form>
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <EditorImagePreview />
        </div>
      </div>
    </div>
  );
}
