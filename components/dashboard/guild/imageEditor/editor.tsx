import { Divider } from "@heroui/divider";
import { CardEditor } from "./cardEditor";
import { CardLib } from "./cardLib";
import { EditorImagePreview } from "./editorImagePreview";
import SaveButton from "./saveButton";

export function Editor() {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row flex-auto space-y-5 py-3">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-auto no-scrollbar px-2">
          <CardLib />
          <Divider className="my-3" />
          <CardEditor />
          <SaveButton />
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <EditorImagePreview />
        </div>
      </div>
  );
}
