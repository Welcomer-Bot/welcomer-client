import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { Button } from "@heroui/react";
import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { useStore } from "zustand";

export function ClearCardsButton() {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const cards = useStore(store, (state) => state.imageCards);
  const clearCards = useStore(store, (state) => state.clearCards);

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
