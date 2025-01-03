import EditorMessagePreview from "./editorMessagePreview";
import { Divider } from "@nextui-org/divider";
import SendMenu from "@/components/dashboard/guild/editor/sendMenu";
import ContentEditor from "./contentEditor";
import { EmbedEditor } from "./embed/embedEditor";
import SaveButton from "./saveButton";

export function Editor({ guildId }: { guildId: string }) {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-auto no-scrollbar">
          <form className="px-5 pt-5 pb-20 space-y-5 w-full relative">
            <SendMenu />
            <Divider className="my-4" />
            <ContentEditor />
            <EmbedEditor />
            <SaveButton guildId={guildId}/>
          </form>
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <EditorMessagePreview />
        </div>
      </div>
    </div>
  );
}