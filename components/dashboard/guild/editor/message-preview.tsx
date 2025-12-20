"use client";

import { GuildObject } from "@/lib/discord/guild";
import { parseMessageToReactElement } from "@/lib/discord/text";
import { UserObject } from "@/lib/discord/user";
import { SourceState } from "@/state/source";
import { useMemo } from "react";
import { useImageEditor } from "../image-editor";

export default function MessagePreview({
  msg,
  guild,
  user,
}: {
  msg: SourceState;
  guild: GuildObject;
  user: UserObject;
}) {
  const { card } = useImageEditor(msg.guildId, msg.activeCard?.data || {});

  const text = useMemo(() => {
    if (!user || !guild) return null;
    return parseMessageToReactElement(msg.message, user, guild, {
      image: card || undefined,
      imagePosition: msg.imagePosition,
      imageEmbedIndex: msg.imageEmbedIndex,
    });
  }, [msg.message, msg.imagePosition, msg.imageEmbedIndex, user, guild, card]);

  return (
    <div className="rounded-lg min-h-1/2 h-fit w-full min-w-fit">{text}</div>
  );
}
