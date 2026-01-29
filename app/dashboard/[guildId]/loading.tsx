import { Chip } from "@heroui/chip";
export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center content-center items-center text-center">
      <Chip color="warning" variant="shadow" size="lg">
        Loading...
      </Chip>
    </div>
  );
}
