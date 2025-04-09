import SendMenu from "@/components/dashboard/guild/editor/sendMenu";
import Guild from "@/lib/discord/guild";
import User from "@/lib/discord/user";
import { ModuleName } from "@/types";
import { Divider } from "@heroui/divider";
import { CardPositionEditor } from "./card/editor";
import ContentEditor from "./contentEditor";
import EditorMessagePreview from "./editorMessagePreview";
import { EmbedEditor } from "./embed/embedEditor";
import SaveButton from "./saveButton";

export async function Editor({
  module,
  guild,
  user,
}: {
  module: ModuleName;
  guild: Guild;
  user: User;
}) {
  await guild.getChannels();
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col lg:flex-row h-full flex-auto w-full">
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-scroll no-scrollbar lg:pb-24">
          <form className="px-5 pt-5 lg:pb-20 space-y-5 w-full relative">
            <SendMenu module={module} channels={guild.channels} />
            <Divider className="my-4" />
            <ContentEditor module={module} />
            <EmbedEditor module={module} />
            <Divider className="my-4" />
            <CardPositionEditor module={module} />
          </form>
          <SaveButton module={module} />
        </div>
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 lg:hidden block">
            <Divider className="my-4" />
            <h2 className="text-white text-lg font-semibold">Preview</h2>
          </div>
          <EditorMessagePreview module={module} guild={guild.toObject()} user={user.toObject()} />
        </div>
      </div>
    </div>
  );
}
