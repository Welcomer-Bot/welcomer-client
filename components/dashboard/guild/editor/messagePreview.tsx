"use client";

import { GuildObject } from "@/lib/discord/guild";
import { parseMessageToReactElement } from "@/lib/discord/text";
import { UserObject } from "@/lib/discord/user";
import { SourceState } from "@/state/source";
import { useEffect, useState, JSX } from "react";
export default function MessagePreview({
  msg,
  guild,
  user,
}: {
  msg: SourceState;
  guild: GuildObject;
  user: UserObject;
}) {
  // const [image, setImage] = useState<string | undefined>(undefined);
  const [text, setText] = useState<JSX.Element>();
  // useEffect(() => {
  //   if (msg.activeCard) {
  //     const loadImage = async () => {
  //       if (!msg.activeCard) return;
  //       if (!msg.guildId) return;
  //       const image = await generateImage(
  //         msg.activeCard as BaseCardParams,
  //         msg.guildId
  //       );
  //       setImage(image);
  //     };
  //     loadImage();
  //   }
  // }, [msg.activeCard, msg.guildId, msg]);

  useEffect(() => {
    if (!user || !guild) return;
    setText(parseMessageToReactElement({
      ...msg.message,
      ...msg.modified.message
    }, user, guild)
    );
  }, [msg, user, guild]);


  return (
    <div className="rounded-lg min-h-full w-full min-w-fit">
      {text}
    </div>
  );
}
