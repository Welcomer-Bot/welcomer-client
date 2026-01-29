"use client";

import {GuildObject} from "@/lib/discord/guild";
import {parseMessageToReactElement} from "@/lib/discord/text";
import {UserObject} from "@/lib/discord/user";
import {SourceState} from "@/state/source";
import {useMemo, useState} from "react";
import {useImageEditor} from "../image-editor";

export default function MessagePreview({
                                           msg,
                                           guild,
                                           user,
                                       }: Readonly<{
    msg: SourceState;
    guild: GuildObject;
    user: UserObject;
}>) {
    const {isLoading} = useImageEditor(
        msg.guildId,
        msg.activeCard?.data || {},
    )
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | undefined>(undefined);

    const htmlCanvasElement = document.getElementById("preview-canvas");
    if (htmlCanvasElement instanceof HTMLCanvasElement) {
        setCanvasElement(htmlCanvasElement);
    }


    const text = useMemo(() => {
        if (!user || !guild) return null;

        return parseMessageToReactElement(msg.message, user, guild, {
            image: canvasElement,
            imagePosition: msg.imagePosition,
            imageEmbedIndex: msg.imageEmbedIndex,
            isLoadingImage: isLoading,
        });
    }, [msg, user, guild, isLoading, canvasElement]);

    return (
        <>
            <div className="rounded-lg min-h-1/2 h-fit w-full min-w-fit">{text}</div>
            <span className={"hidden"}>

      <canvas id={"preview-canvas"}></canvas>
      </span>
        </>
    );
}
