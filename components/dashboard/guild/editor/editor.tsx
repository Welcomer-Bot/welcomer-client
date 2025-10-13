import SendMenu from "@/components/dashboard/guild/editor/send-menu";
import Guild from "@/lib/discord/guild";

import { getUser } from "@/lib/dal";
import { Divider } from "@heroui/divider";
import ContentEditor from "./content-editor";
import EditorMessagePreview from "./editor-message-preview";
import { EmbedEditor } from "./embed/embed-editor";
import SaveButton from "./save-button";

export async function Editor({ guild }: { guild: Guild }) {
  const user = await getUser();
  const channels = await guild.getChannels();
  return (
    <div className="flex h-full w-full editor relative">
      <div className="flex flex-col lg:flex-row lg:h-screen h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-scroll no-scrollbar lg:pb-24 justify-center align-middle">
          <form className="px-5 pt-5 lg:pb-20 space-y-5 w-full relative">
            <SendMenu channels={channels} />
            <Divider className="my-4" />
            <ContentEditor />
            <EmbedEditor />
            <Divider className="my-4" />
            {/* <CardPositionEditor /> */}
          </form>
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 lg:hidden block">
            <Divider className="my-4" />
            <h2 className="text-white text-lg font-semibold">Preview</h2>
          </div>
          <EditorMessagePreview
            guild={guild.toObject()}
            user={user!.toObject()}
          />
        </div>
      </div>
      <SaveButton />
    </div>
  );
}
