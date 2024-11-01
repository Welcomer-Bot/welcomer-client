"use client";
import { useWelcomerStore } from "@/state/welcomer";
import { Leaver, Welcomer } from "@prisma/client";
import { stat } from "fs";


export function StoreUpdater({ module }: { module: Welcomer | Leaver }) {
    const welcomerStore = useWelcomerStore((state) => state.id);
    if (!welcomerStore) {
     
        useWelcomerStore.setState({
            id: module.id,
            guildId: module.guildId,
            channelId: module.channelId,
            content: module.content,
        });
    }

    return null;

}  
