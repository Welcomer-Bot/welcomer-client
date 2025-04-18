import { Editor } from "@/components/dashboard/guild/imageEditor/editor";
import { Card } from "@heroui/card";

export default function Page() {
  return (
    <Card
      radius="none"
      className=" lg:overflow-y-clip overflow-y-scroll h-full"
    >
      <Editor module="leaver" />
    </Card>
  );
}
