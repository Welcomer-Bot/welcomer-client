"use client";

import { useImageStore } from "@/state/image";
import { CreateCardButton } from "./createCardButton";

export function CardLib() {
  const cards = useImageStore((state) => state.imageCards);

    return (<>
        {cards.length > 0 ? cards.map((card, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-3 rounded-lg">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-dark-2 rounded-lg"></div>
                    <div>
                        <div className="text-white font-semibold">Card {index + 1}</div>
                        <div className="text-gray-400 text-sm">Card description</div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="text-white">Edit</button>
                    <button className="text-red-500">Delete</button>
                </div>
            </div>
        )) : 
        <div className="text-white">No cards found</div>
        }
        <CreateCardButton />
    </>)
}
