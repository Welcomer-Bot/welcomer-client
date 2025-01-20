import { useImageStore } from "@/state/image";
import { Button } from "@nextui-org/button";
import { FaPlus } from "react-icons/fa";

export function CreateCardButton() {
  const createCard = useImageStore((state) => state.createCard);
  const cards = useImageStore((state) => state.imageCards);
  return (
    <Button
      onPress={createCard}
      startContent={<FaPlus />}
      isDisabled={cards.length >= 5}
    >
      Create Card
    </Button>
  );
}

