import { ImageStoreContext } from "@/providers/imageStoreProvider";
import { Button } from "@heroui/react";
import { useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { useStore } from "zustand";

export function CreateCardButton() {
  const store = useContext(ImageStoreContext);
  if (!store) throw new Error("Missing ImageStore.Provider in the tree");

  const cards = useStore(store, (state) => state.imageCards);
  const createCard = useStore(store, (state) => state.createCard);
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
