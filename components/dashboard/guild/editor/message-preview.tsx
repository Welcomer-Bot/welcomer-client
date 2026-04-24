"use client";

import { GuildObject } from "@/lib/discord/guild-types";
import { parseMessageToReactElement } from "@/lib/discord/text";
import { UserObject } from "@/lib/discord/user";
import { SourceState } from "@/features/dashboard/modules/stores";
import { useCallback, useMemo, useRef } from "react";
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
  // Persistent canvas DOM node — created once, reparented via appendChild
  // to survive position switches without remounting (which would clear it
  // and re-trigger the hook's debounce).
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (!canvasRef.current && typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 350;
    c.className = "w-full h-auto rounded";
    canvasRef.current = c;
  }

  useImageEditor(
    canvasRef.current,
    msg.guildId,
    msg.activeCard?.data ?? null,
  );

  const hostRef = useCallback((el: HTMLDivElement | null) => {
    if (el && canvasRef.current) {
      el.appendChild(canvasRef.current);
    }
  }, []);

  const canvasNode = useMemo(
    () => <div ref={hostRef} className="contents" />,
    [hostRef],
  );

  const text = useMemo(() => {
    if (!user || !guild) return null;

    return parseMessageToReactElement(msg.message, user, guild, {
      canvas: canvasNode,
      imagePosition: msg.imagePosition,
      imageEmbedIndex: msg.imageEmbedIndex,
    });
  }, [msg, user, guild, canvasNode]);

  return (
    <div className="rounded-lg min-h-1/2 h-fit w-full min-w-fit">{text}</div>
  );
}
