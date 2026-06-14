import { Card, CardBody, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default async function GuildCardLoader() {
  return (
    <Card className="w-[350px] relative radius-8 mb-10 min-w-60 justify-evenly mx-4">
      <CardBody className="p-0 flex justify-center">
        <Skeleton className="w-full h-32" />
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-row items-center">
          <Skeleton className="w-12 h-12 rounded-full mr-3" />
          <Skeleton className="w-24 h-6" />
        </div>
        <Skeleton className="w-20 h-8 rounded" />
      </CardFooter>
    </Card>
  );
}
