"use client";

import { useWelcomerEmbedsQuery } from "@/lib/queries";
import { useEmbedsStore } from "@/state/embeds";
import { useWelcomerStore } from "@/state/welcomer";
import { useEffect } from "react";

export function EmbedEditor() {
    const guildId = useWelcomerStore((state) => state.guildId);
    const { data: embeds } = useWelcomerEmbedsQuery(guildId);
    const setEmbeds = useEmbedsStore((state) => state.setEmbeds);

    useEffect(() => {
        if (embeds) {
          console.log("embeds", embeds);
        setEmbeds(embeds);
      }
    }, [embeds, setEmbeds]);

    return (
        <div>
            {embeds && embeds.map((embed) => (
                <div key={embed.id}>
                    <h3>{embed.title}</h3>
                    <p>{embed.description}</p>
                </div>
            ))}
        </div>
    );

}