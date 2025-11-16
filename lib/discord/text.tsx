import {
  DiscordBold,
  DiscordCode,
  DiscordItalic,
  DiscordMention,
} from "@skyra/discord-components-react";
import { APIEmbed, RESTPostAPIChannelMessageJSONBody } from "discord.js";
import reactStringReplace from "react-string-replace";
import { GuildObject } from "./guild";
import { UserObject } from "./user";

export function parseText(
  text: string | undefined,
  user: UserObject,
  guild: GuildObject
) {
  //TODO: add all the other variables
  if (!text) return "";
  return text
    .replaceAll(/{id}/g, user.id)
    .replaceAll(/{displayname}/g, user.username)
    .replaceAll(/{discriminator}/g, user.discriminator)
    .replaceAll(/{guild}/g, guild.name)
    .replaceAll(/{membercount}/g, guild.memberCount.toString())
    .replaceAll(/{guildid}/g, guild.id)
    .replaceAll(/{username}/g, user.username)
    .replaceAll(/{user}/g, user.username);
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

// Helper to render embed fields using DiscordEmbedFields/DiscordEmbedField
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

// Helper to render a single embed using DiscordEmbed and related components
function renderEmbed(
  embed: APIEmbed,
  user: UserObject,
  guild: GuildObject,
  idx: number,
  imageUrl?: string
) {
  console.log("Rendering embed:", embed, imageUrl);
  return (
    <DiscordEmbed
      key={idx}
      slot="embeds"
      color={
        embed.color
          ? `#${embed.color.toString(16).padStart(6, "0")}`
          : undefined
      }
      embedTitle={parseText(embed.title, user, guild)}
      authorName={embed.author?.name}
      authorImage={embed.author?.icon_url}
      title={parseText(embed.title, user, guild)}
      url={embed.url}
      image={imageUrl || embed.image?.url}
      thumbnail={embed.thumbnail?.url}
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
          }))
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
    </DiscordEmbed>
  );
}

export function parseMessageToReactElement(
  message: RESTPostAPIChannelMessageJSONBody,
  user: UserObject,
  guild: GuildObject,
  options?: {
    image?: string;
    imagePosition?: "outside" | "embed";
    imageEmbedIndex?: number;
  }
) {
  // Render the main message content using parseMessageText
  const content = message.content
    ? parseMessageText(message.content, user, guild)
    : null;

  // Render embeds if present
  let embeds = null;
  if (Array.isArray(message.embeds) && message.embeds.length > 0) {
    embeds = (message.embeds as APIEmbed[]).map((embed, idx) => {
      // Si l'image doit être dans un embed et c'est le bon index
      const shouldIncludeImage =
        options?.image &&
        options.imagePosition === "embed" &&
        options.imageEmbedIndex === idx;

      return renderEmbed(
        embed,
        user,
        guild,
        idx,
        shouldIncludeImage ? options.image : undefined
      );
    });
  }

  // Image à l'extérieur des embeds
  const outsideImage =
    options?.image && options.imagePosition === "outside" ? (
      <DiscordImageAttachment
        slot="attachments"
        url={options.image}
        alt="generated card"
      />
    ) : null;

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
        {outsideImage}
      </DiscordMessage>
    </DiscordMessages>
  );
}
