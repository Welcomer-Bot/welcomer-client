import { useImageStore } from "@/state/image";
import { Button } from "@nextui-org/button";
import { FaTrash } from "react-icons/fa";

export function ClearCardsButton() {
  const clearCards = useImageStore((state) => state.clearCards);
  const cards = useImageStore((state) => state.imageCards);
  return (
    <Button
      onPress={clearCards}
          startContent={<FaTrash />}
          color="danger"
          variant="ghost"
      isDisabled={cards.length === 0}
    >
      Clear Card(s)
    </Button>
  );
}
