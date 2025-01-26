import { Editor } from "@/components/dashboard/guild/imageEditor/editor";
import { Card } from "@nextui-org/card";

export default function Page() {
  return (
    <Card
      radius="none"
      className=" md:overflow-y-clip overflow-y-scroll h-full"
    >
      <Editor />
    </Card>
  );
}
