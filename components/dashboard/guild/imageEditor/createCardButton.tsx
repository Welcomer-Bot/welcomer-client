import { useImageStore } from "@/state/image";
import { Button } from "@nextui-org/button";
import { FaPlus } from "react-icons/fa";

export function CreateCardButton() {
  const createCard = useImageStore((state) => state.createCard);
  return (
    <Button
      onPress={createCard}
      startContent={<FaPlus />}
    >
      Create Card
    </Button>
  );
}

