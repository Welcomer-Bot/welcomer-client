import {
  DiscordBold,
  DiscordCode,
  DiscordItalic,
  DiscordMention,
} from "@skyra/discord-components-react";
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
  replacedText = reactStringReplace(
    replacedText,
    /`([^`]+)`/g,
    (match, i) => (
      <DiscordCode key={match + i}>{match}</DiscordCode>
    )
  );

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
    (match, i) => (
      <DiscordBold key={match + i}>{match}</DiscordBold>
    )
  );

  // Replace italic (*text*)
  replacedText = reactStringReplace(
    replacedText,
    /\*(.+?)\*/g,
    (match, i) => (
      <DiscordItalic key={match + i}>{match}</DiscordItalic>
    )
  );

  // Replace underline (__text__)
  replacedText = reactStringReplace(
    replacedText,
    /\_\_(.+?)\_\_/g,
    (match, i) => (
      <u key={match + i}>{match}</u>
    )
  );

  // Replace strikethrough (~~text~~)
  replacedText = reactStringReplace(
    replacedText,
    /\~\~(.+?)\~\~/g,
    (match, i) => (
      <s key={match + i}>{match}</s>
    )
  );

  return replacedText;
}
