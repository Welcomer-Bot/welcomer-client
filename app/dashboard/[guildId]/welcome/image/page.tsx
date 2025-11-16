import { Editor } from "@/components/dashboard/guild/image-editor/editor";
import { Card } from "@heroui/card";

export default async function Page({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;

  return (
    <Card
      radius="none"
      className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll w-full"
    >
      <Editor module="Welcomer" guildId={guildId} />
    </Card>
  );
}
