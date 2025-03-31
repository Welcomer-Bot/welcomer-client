import { getGuildData, getUserData } from "@/lib/dal";
import { GuildObject } from "@/lib/discord/guild";
import { generateImage } from "@/lib/discord/image";
import { parseMessageText, parseText } from "@/lib/discord/text";
import { UserObject } from "@/lib/discord/user";
import {
  CompleteEmbed,
  CompleteEmbedField,
  CompleteLeaver,
  CompleteWelcomer,
} from "@/prisma/schema";
import {
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
  DiscordImageAttachment,
  DiscordMessage,
  DiscordMessages,
} from "@skyra/discord-components-react";
import { BaseCardParams } from "@welcomer-bot/card-canvas";
import { ReactNode, useEffect, useState } from "react";

export default function MessagePreview({
  msg,
}: {
  msg:
    | CompleteWelcomer
    | (CompleteLeaver & {
        deletedEmbeds: CompleteEmbed[];
        deletedFields: CompleteEmbedField[];
      });
}) {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<UserObject | null>(null);
  const [guild, setGuild] = useState<GuildObject | null>(null);
  const [text, setText] = useState<{
    content?: string | ReactNode[] | null;
    embeds?: {
      timestampNow?: boolean;
      timestamp?: string | null;
      url?: string | null;
      thumbnail?: string | null;
      color?: string | null;
      description?: string | ReactNode[] | null;
      title?: string | null;
      footer?: {
        text?: string | null;
        iconUrl?: string | null;
      };
      author?: {
        name?: string | null;
        iconUrl?: string | null;
        url?: string | null;
      };
      fields?: {
        name: string;
        value: string | ReactNode[] | null;
        inline?: boolean;
      }[];
    }[];
  }>(msg);
  useEffect(() => {
    if (msg.activeCard) {
      const loadImage = async () => {
        if (!msg.activeCard) return;
        if (!msg.guildId) return;
        const image = await generateImage(
          msg.activeCard as BaseCardParams,
          msg.guildId
        );
        setImage(image);
      };
      loadImage();
    }
    const loadUserAndGuild = async () => {
      if (!msg.guildId) return;
      const userData = await getUserData();
      setUser(userData);
      const guildData = await getGuildData(msg.guildId);
      setGuild(guildData);
    };
    loadUserAndGuild();
  }, [msg.activeCard, msg.guildId, msg]);

  useEffect(() => {
    console.log("msg", msg);
    if (!user || !guild) return;
    setText((prevText) => ({
      ...prevText,
      content: parseMessageText(msg.content ?? "", user, guild),
      embeds: msg.embeds?.map((embed) => ({
        description: parseMessageText(embed.description ?? "", user, guild),
        title: parseText(embed.title ?? "", user, guild) ?? null,
        footer: embed.footer
          ? {
              text: parseText(embed.footer.text ?? "", user, guild) ?? null,
              iconUrl: embed.footer.iconUrl ?? null,
            }
          : undefined,
        author: embed.author
          ? {
              name: parseText(embed.author.name ?? "", user, guild) ?? null,
              iconUrl: embed.author.iconUrl ?? null,
              url: embed.author.url ?? null,
            }
          : undefined,
        fields: embed.fields?.map((field) => ({
          name: parseText(field.name ?? "", user, guild) ?? null,
          value: parseText(field.value ?? "", user, guild) ?? null,
          inline: field.inline ?? false,
        })),
      })),
    }));
  }, [msg, user, guild]);

  return (
    <>
      <DiscordMessages className="rounded-lg min-h-full w-full min-w-fit">
        <DiscordMessage author="Welcomer" avatar="/logo.svg" bot verified>
          {text.content}
          {((msg.activeCardToEmbedId === -1 && msg.activeCard) ||
            (msg.activeCardToEmbedId == null &&
              msg.activeCard &&
              msg.activeCardId)) &&
            image && <DiscordImageAttachment url={image} width={300} />}
          <div>
            {text.embeds &&
              text.embeds.map((embed, index) => {
                return (
                  <DiscordEmbed
                    slot="embeds"
                    color={embed.color?.toString()}
                    key={index}
                    embedTitle={embed.title ?? undefined}
                    authorName={embed.author?.name ?? ""}
                    authorImage={embed.author?.iconUrl ?? undefined}
                    authorUrl={embed.author?.url ?? undefined}
                    url={embed.url ?? undefined}
                    thumbnail={embed.thumbnail ?? undefined}
                    image={
                      msg.activeCardToEmbedId === index && image
                        ? image
                        : undefined
                    }
                  >
                    <DiscordEmbedDescription slot="description">
                      {embed.description}
                    </DiscordEmbedDescription>
                    {embed.fields && (
                      <DiscordEmbedFields slot="fields">
                        {embed.fields.map((field, index) => (
                          <DiscordEmbedField
                            key={index}
                            inline={field.inline ?? undefined}
                            fieldTitle={field.name}
                          >
                            {field.value}
                          </DiscordEmbedField>
                        ))}
                      </DiscordEmbedFields>
                    )}
                    <DiscordEmbedFooter
                      slot="footer"
                      footerImage={embed.footer?.iconUrl ?? undefined}
                      timestamp={
                        embed.timestampNow
                          ? new Date().toISOString()
                          : embed.timestamp
                      }
                    >
                      {embed.footer?.text}
                    </DiscordEmbedFooter>
                  </DiscordEmbed>
                );
              })}
          </div>
        </DiscordMessage>
      </DiscordMessages>
    </>
  );
}
