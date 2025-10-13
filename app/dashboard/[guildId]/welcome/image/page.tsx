import { Editor } from "@/components/dashboard/guild/image-editor/editor";
import { Card } from "@heroui/card";

export default function Page() {
  return (
    <Card
      radius="none"
      className="h-fit md:h-full lg:overflow-y-clip overflow-y-scroll w-full"
    >
      <Editor module={"Welcomer"} />
    </Card>
  );
}
