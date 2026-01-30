"use client";

import { GuildObject } from "@/lib/discord/guild";
import { parseMessageToReactElement } from "@/lib/discord/text";
import { UserObject } from "@/lib/discord/user";
import { SourceState } from "@/state/source";
import { useCallback, useMemo, useState } from "react";
import { useImageEditor } from "../image-editor/hooks/use-image-editor";

export default function MessagePreview({
  msg,
  guild,
  user,
}: Readonly<{
  msg: SourceState;
  guild: GuildObject;
  user: UserObject;
}>) {
  const { isLoading } = useImageEditor(msg.guildId, msg.activeCard?.data || {});
  const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>(
    undefined,
  );

  const canvasCallbackRef = useCallback((node: HTMLCanvasElement | null) => {
    if (node) {
      setCanvas(node);
    }
  }, []);

  const canvasRef = useMemo(() => ({ current: canvas }), [canvas]);

  const text = useMemo(() => {
    if (!user || !guild) return null;

    return parseMessageToReactElement(msg.message, user, guild, {
      image: canvasRef,
      imagePosition: msg.imagePosition,
      imageEmbedIndex: msg.imageEmbedIndex,
      isLoadingImage: isLoading,
    });
  }, [msg, user, guild, isLoading, canvasRef]);

  return (
    <>
      <div className="rounded-lg min-h-1/2 h-fit w-full min-w-fit">{text}</div>
      <span className={"hidden"}>
        <canvas id={"preview-canvas"} ref={canvasCallbackRef}></canvas>
      </span>
    </>
  );
}
