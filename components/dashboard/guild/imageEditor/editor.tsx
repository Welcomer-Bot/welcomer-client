import { SourceType } from "@/prisma/generated/client";
import { Divider } from "@heroui/divider";
import { CardEditor } from "./cardEditor";
import { CardLib } from "./cardLib";
import { EditorImagePreview } from "./editorImagePreview";
import SaveButton from "./saveButton";

export function Editor({ module }: { module: SourceType }) {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full overflow-y-auto">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-auto no-scrollbar px-2 pb-20">
          <form className="px-5 pt-5 lg:pb-20 space-y-5 w-full relative">
            <CardLib />
            <Divider className="my-3" />
            <CardEditor module={module} />
          </form>
        </div>
        <SaveButton />
        <div className="block pb-24 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <EditorImagePreview />
        </div>
      </div>
    </div>
  );
}
