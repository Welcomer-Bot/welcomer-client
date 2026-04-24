"use client";

import {
  DiscordBold,
  DiscordCode,
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
  DiscordImageAttachment,
  DiscordItalic,
  DiscordMention,
  DiscordMessage,
  DiscordMessages,
} from "@welcomer-bot/discord-components-react";
import {APIEmbed, RESTPostAPIChannelMessageJSONBody} from "discord.js";
import React, {ReactNode} from "react";
import reactStringReplace from "react-string-replace";
import {GuildObject} from "./guild-types";
import {UserObject} from "./user";

export function parseText(
  text: string | undefined,
  user: UserObject,
  guild: GuildObject,
  image: boolean = false,
) {
  //TODO: add all the other variables
  if (!text) return "";
  let replacedText = text
    .replaceAll(/{id}/g, user.id)
    .replaceAll(/{userid}/g, user.id)
    .replaceAll(/{displayname}/g, user.username)
    .replaceAll(/{discriminator}/g, user.discriminator)
    .replaceAll(/{guild}/g, guild.name)
    .replaceAll(/{memberCount}/g, guild.memberCount.toString())
    .replaceAll(/{guildid}/g, guild.id)
    .replaceAll(/{username}/g, user.username);
  if (image) {
    replacedText = replacedText.replaceAll(/{user}/g, user.username);
  }
  return replacedText;
  // Note: {user} is NOT replaced here, it's handled by parseMessageText for mentions
}

export function parseMessageText(
  text: string,
  user: UserObject,
  guild: GuildObject,
) {
  // First, replace all non-mention variables with a simple string replacement
  const processedText = parseText(text, user, guild);

  // Now replace {user} with a DiscordMention component
  // Use a capturing group to ensure the pattern works correctly
  let replacedText: React.ReactNode[] | string = reactStringReplace(
    processedText,
    /(\{user\})/g,
    (match, i) => (
      <DiscordMention highlight key={`user-${i}`}>
        {user.username}
      </DiscordMention>
    ),
  );

  // Replace multiline code blocks (```code```)
  replacedText = reactStringReplace(
    replacedText,
    /```([\s\S]+?)```/g,
    (match, i) => (
      <DiscordCode multiline key={match + i}>
        {match}
      </DiscordCode>
    ),
  );

  // Replace inline code (`code`)
  replacedText = reactStringReplace(replacedText, /`([^`]+)`/g, (match, i) => (
    <DiscordCode key={match + i}>{match}</DiscordCode>
  ));

  // Replace bold italic underline (**_***text***_**)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*\_\*\*\*(.+?)\*\*\*\_\*\*/g,
    (match, i) => (
      <DiscordBold key={match + i}>
        <DiscordItalic>
          <u>{match}</u>
        </DiscordItalic>
      </DiscordBold>
    ),
  );

  // Replace bold underline (**_text_**)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*\_(.+?)\_\*\*/g,
    (match, i) => (
      <DiscordBold key={match + i}>
        <u>{match}</u>
      </DiscordBold>
    ),
  );

  // Replace bold italic (***text***)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*\*(.+?)\*\*\*/g,
    (match, i) => (
      <DiscordBold key={match + i}>
        <DiscordItalic>{match}</DiscordItalic>
      </DiscordBold>
    ),
  );

  // Replace bold (**text**)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*(.+?)\*\*/g,
    (match, i) => <DiscordBold key={match + i}>{match}</DiscordBold>,
  );

  // Replace italic (*text*)
  replacedText = reactStringReplace(replacedText, /\*(.+?)\*/g, (match, i) => (
    <DiscordItalic key={match + i}>{match}</DiscordItalic>
  ));

  // Replace underline (__text__)
  replacedText = reactStringReplace(
    replacedText,
    /\_\_(.+?)\_\_/g,
    (match, i) => <u key={match + i}>{match}</u>,
  );

  // Replace strikethrough (~~text~~)
  replacedText = reactStringReplace(
    replacedText,
    /\~\~(.+?)\~\~/g,
    (match, i) => <s key={match + i}>{match}</s>,
  );

  return replacedText;
}

function renderEmbedFields(fields: APIEmbed["fields"]) {
  return (
    <DiscordEmbedFields slot="fields">
      {fields?.map((field, i) => (
        <DiscordEmbedField
          key={i}
          fieldTitle={field.name}
          inline={!!field.inline}
        >
          {field.value}
        </DiscordEmbedField>
      ))}
    </DiscordEmbedFields>
  );
}

function renderEmbed(
  embed: APIEmbed,
  user: UserObject,
  guild: GuildObject,
  idx: number,
  imageNode?: ReactNode,
) {
  return (
    <DiscordEmbed
      key={idx}
      slot="embeds"
      color={
        embed.color
          ? `#${embed.color.toString(16).padStart(6, "0")}`
          : undefined
      }
      className="w-full"
      embedTitle={parseText(embed.title, user, guild)}
      authorName={embed.author?.name}
      authorImage={embed.author?.icon_url}
      title={parseText(embed.title, user, guild)}
      url={embed.url}
      thumbnail={embed.thumbnail?.url}
      customImageElement={!!imageNode}
    >
      {embed.description && (
        <DiscordEmbedDescription slot="description">
          {parseText(embed.description, user, guild)}
        </DiscordEmbedDescription>
      )}
      {embed.fields &&
        Array.isArray(embed.fields) &&
        renderEmbedFields(
          embed.fields.map((field) => ({
            name: parseText(field.name, user, guild),
            value: parseText(field.value, user, guild),
            inline: field.inline,
          })),
        )}
      {embed.footer && (
        <DiscordEmbedFooter
          footerImage={embed.footer.icon_url}
          timestamp={embed.timestamp}
          slot="footer"
        >
          {parseText(embed.footer.text, user, guild)}
        </DiscordEmbedFooter>
      )}
      {imageNode}
    </DiscordEmbed>
  );
}

export function parseMessageToReactElement(
  message: RESTPostAPIChannelMessageJSONBody,
  user: UserObject,
  guild: GuildObject,
  options?: {
    canvas?: ReactNode;
    imagePosition?: "outside" | "embed";
    imageEmbedIndex?: number;
  },
) {
  // Render the main message content using parseMessageText
  const content = message.content
    ? parseMessageText(message.content, user, guild)
    : null;

  // Render embeds if present
  let embeds = null;
  if (Array.isArray(message.embeds) && message.embeds.length > 0) {
    embeds = message.embeds.map((embed, idx) => {
      const shouldIncludeImage =
        options?.imagePosition === "embed" && options.imageEmbedIndex === idx;

      const imageNode =
        shouldIncludeImage && options?.canvas ? options.canvas : undefined;

      return renderEmbed(embed, user, guild, idx, imageNode);
    });
  }

  // Render outside image if specified.
  // Note: DiscordMessage shadow DOM renders the `attachments` slot before `embeds`,
  // so we project into `components` (which renders after embeds) to get the
  // expected "image below embed" visual order.
  const outsideImage =
    options?.imagePosition === "outside" && options?.canvas ? (
      <DiscordImageAttachment slot="components" customImageElement={true}>
        {options.canvas}
      </DiscordImageAttachment>
    ) : null;

  return (
    <DiscordMessages className="h-full">
      <DiscordMessage
        author={"Welcomer"}
        avatar="/logo.svg"
        bot
        verified
        highlight={content?.includes("{user}")}
        className="pl-4"
      >
        {content}
        {embeds}
        {outsideImage}
      </DiscordMessage>
    </DiscordMessages>
  );
}
