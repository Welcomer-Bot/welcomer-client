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
  replacedText = reactStringReplace(
    parseText(text, user, guild),
    /({user})/g,
    (match, i) => (
      <DiscordMention highlight key={match + i}>
        {user.username}
      </DiscordMention>
    )
  );
  replacedText = reactStringReplace(
    replacedText,
    /(\`\`\`.+\`\`\`)/g,
    (match, i) => (
      <DiscordCode multiline key={match + i}>
        {match.replaceAll(/`/g, "")}
      </DiscordCode>
    )
  );

  replacedText = reactStringReplace(replacedText, /(\_.+\_)/g, (match, i) => (
    <DiscordItalic key={match + i}>{match.replaceAll(/_/g, "")}</DiscordItalic>
  ));
    replacedText = reactStringReplace(
      replacedText,
      /(\*\*\*.+\*\*\*)/g,
      (match, i) => (
        <DiscordBold key={match + i}>
          <DiscordItalic>{match.replaceAll(/\*\*/g, "")}</DiscordItalic>
        </DiscordBold>
      )
    );
  
   replacedText = reactStringReplace(
     replacedText,
     /(\*\*.+\*\*)/g,
     (match, i) => (
       <DiscordBold key={match + i}>
         {match.replaceAll(/\*\*/g, "")}
       </DiscordBold>
     )
   );

  replacedText = reactStringReplace(replacedText, /(\*.+[^\*]\*)/g, (match, i) => (
    <DiscordItalic key={match + i}>{match.replaceAll(/\*/g, "")}</DiscordItalic>
  ));

 



  return replacedText;
}
