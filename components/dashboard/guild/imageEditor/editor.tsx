import { Divider } from "@nextui-org/divider";
import { CardEditor } from "./cardEditor";
import { CardLib } from "./cardLib";
import { EditorImagePreview } from "./editorImagePreview";
import SaveButton from "./saveButton";

export function Editor() {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-auto no-scrollbar px-1">
          <CardLib />
          <Divider className="my-3"/>
          <CardEditor />
          <SaveButton />
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <EditorImagePreview />
        </div>
      </div>
    </div>
  );
}
