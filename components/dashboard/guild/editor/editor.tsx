import EditorMessagePreview from "./editorMessagePreview";
import { Divider } from "@heroui/divider";
import SendMenu from "@/components/dashboard/guild/editor/sendMenu";
import ContentEditor from "./contentEditor";
import { EmbedEditor } from "./embed/embedEditor";
import SaveButton from "./saveButton";
import { CardPositionEditor } from "./card/editor";
import Guild from "@/lib/discord/guild";

export async function Editor({ guild }: { guild: Guild }) {
  await guild.getChannels();
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-scroll no-scrollbar lg:pb-24">
          <form className="px-5 pt-5 lg:pb-20 space-y-5 w-full relative">
            <SendMenu
              channels={
                guild.channels
              }
            />
            <Divider className="my-4" />
            <ContentEditor />
            <EmbedEditor />
            <Divider className="my-4" />
            <CardPositionEditor />
          </form>
          <SaveButton />
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 lg:hidden block">
            <Divider className="my-4" />
            <h2 className="text-white text-lg font-semibold">Preview</h2>
          </div>
          <EditorMessagePreview />
        </div>
      </div>
    </div>
  );
}