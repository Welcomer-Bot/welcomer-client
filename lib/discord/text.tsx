import {
  DiscordBold,
  DiscordCode,
  DiscordItalic,
  DiscordMention,
} from "@skyra/discord-components-react";
import { RESTPostAPIChannelMessageJSONBody } from "discord.js";
import reactStringReplace from "react-string-replace";
import { GuildObject } from "./guild";
import { UserObject } from "./user";

export function parseText(text: string, user: UserObject, guild: GuildObject) {
  //TODO: add all the other variables
  return text
    .replaceAll(/{id}/g, user.id)
    .replaceAll(/{displayname}/g, user.username)
    .replaceAll(/{discriminator}/g, user.discriminator)
    .replaceAll(/{guild}/g, guild.name)
    .replaceAll(/{membercount}/g, guild.memberCount.toString())
    .replaceAll(/{guildid}/g, guild.id)
    .replaceAll(/{username}/g, user.username)
    .replaceAll(/{membercount}/g, guild.memberCount.toString());
}

export function parseMessageText(
  text: string,
  user: UserObject,
  guild: GuildObject
) {
  let replacedText;

  // Replace {user} with a DiscordMention
  replacedText = reactStringReplace(
    parseText(text, user, guild),
    /({user})/g,
    (match, i) => (
      <DiscordMention highlight key={match + i}>
        {user.username}
      </DiscordMention>
    )
  );

  // Replace multiline code blocks (```code```)
  replacedText = reactStringReplace(
    replacedText,
    /```([\s\S]+?)```/g,
    (match, i) => (
      <DiscordCode multiline key={match + i}>
        {match}
      </DiscordCode>
    )
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
    )
  );

  // Replace bold underline (**_text_**)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*\_(.+?)\_\*\*/g,
    (match, i) => (
      <DiscordBold key={match + i}>
        <u>{match}</u>
      </DiscordBold>
    )
  );

  // Replace bold italic (***text***)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*\*(.+?)\*\*\*/g,
    (match, i) => (
      <DiscordBold key={match + i}>
        <DiscordItalic>{match}</DiscordItalic>
      </DiscordBold>
    )
  );

  // Replace bold (**text**)
  replacedText = reactStringReplace(
    replacedText,
    /\*\*(.+?)\*\*/g,
    (match, i) => <DiscordBold key={match + i}>{match}</DiscordBold>
  );

  // Replace italic (*text*)
  replacedText = reactStringReplace(replacedText, /\*(.+?)\*/g, (match, i) => (
    <DiscordItalic key={match + i}>{match}</DiscordItalic>
  ));

  // Replace underline (__text__)
  replacedText = reactStringReplace(
    replacedText,
    /\_\_(.+?)\_\_/g,
    (match, i) => <u key={match + i}>{match}</u>
  );

  // Replace strikethrough (~~text~~)
  replacedText = reactStringReplace(
    replacedText,
    /\~\~(.+?)\~\~/g,
    (match, i) => <s key={match + i}>{match}</s>
  );

  return replacedText;
}

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

// Types for Discord embed and fields (partial, for rendering)
type DiscordEmbedFieldType = {
  name: string;
  value: string;
  inline?: boolean;
};

type DiscordEmbedType = {
  color?: number;
  author?: { name?: string; icon_url?: string };
  title?: string;
  url?: string;
  thumbnail?: { url: string };
  description?: string;
  fields?: DiscordEmbedFieldType[];
  image?: { url: string };
  footer?: { text?: string; icon_url?: string };
};

// Helper to render embed fields using DiscordEmbedFields/DiscordEmbedField
function renderEmbedFields(fields: DiscordEmbedFieldType[]) {
  return (
    <DiscordEmbedFields>
      {fields.map((field, i) => (
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

// Helper to render a single embed using DiscordEmbed and related components
function renderEmbed(embed: DiscordEmbedType, idx: number) {
  return (
    <DiscordEmbed
      key={idx}
      slot="embeds"
      color={
        embed.color
          ? `#${embed.color.toString(16).padStart(6, "0")}`
          : undefined
      }
      authorName={embed.author?.name}
      authorImage={embed.author?.icon_url}
      title={embed.title}
      url={embed.url}
      thumbnail={embed.thumbnail?.url}
    >
      {embed.description && (
        <DiscordEmbedDescription>{embed.description}</DiscordEmbedDescription>
      )}
      {embed.fields &&
        Array.isArray(embed.fields) &&
        renderEmbedFields(embed.fields)}
      {embed.image && embed.image.url && (
        <DiscordImageAttachment
          slot="image"
          url={embed.image.url}
          alt="embed image"
        />
      )}
      {embed.footer && (
        <DiscordEmbedFooter footerImage={embed.footer.icon_url}>
          {embed.footer.text}
        </DiscordEmbedFooter>
      )}
    </DiscordEmbed>
  );
}

export function parseMessageToReactElement(
  message: RESTPostAPIChannelMessageJSONBody,
  user: UserObject,
  guild: GuildObject
) {
  console.log("Parsing message:", message);
  // Render the main message content using parseMessageText
  const content = message.content
    ? parseMessageText(message.content, user, guild)
    : null;

  // Render embeds if present
  let embeds = null;
  if (Array.isArray(message.embeds) && message.embeds.length > 0) {
    embeds = (message.embeds as DiscordEmbedType[]).map((embed, idx) =>
      renderEmbed(embed, idx)
    );
  }

  // Optionally, render attachments (not implemented here)

  return (
    <DiscordMessages>
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
      </DiscordMessage>
    </DiscordMessages>
  );
}
