import MessagePreview from "./messagePreview";
import { Divider } from "@nextui-org/divider";
import SendMenu from "@/components/dashboard/guild/editor/sendMenu";
import ContentEditor from "./contentEditor";
import { EmbedEditor } from "./embedEditor";

export function Editor() {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 pb-20 space-y-5">
            <SendMenu />
            <Divider className="my-4" />
            <ContentEditor />
            <EmbedEditor />
            
          </div>
        </div>
        <div className="hidden lg:block w-1/2 h-full bg-dark-4 lg:border-l-2 border-dark-3 px-5 py-2 overflow-y-auto no-scrollbar">
          <MessagePreview />
        </div>
      </div>
    </div>
  );
}
