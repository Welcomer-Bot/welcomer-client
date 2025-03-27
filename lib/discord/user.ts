import { REST } from "@discordjs/rest";
import {
  type APIUser,
  type RESTError,
  type RESTGetAPICurrentUserGuildsResult,
  type RESTGetAPIUserResult,
  Routes,
} from "discord-api-types/v10";
import { cache } from "react";
import { getSessionData } from "../dal";
import { getUserAvatar } from "../utils";
import Guild from "./guild";

export interface UserObject {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  avatarUrl: string;
  bot: boolean;
  discriminator: string;
}

export default class User implements UserObject {
  constructor(data: APIUser) {
    this.id = data.id;
    this.username = data.username;
    this.globalName = data.global_name || null;
    this.avatar = data.avatar;
    this.discriminator = data.discriminator;
    this.avatarUrl = getUserAvatar(this);
    this.bot = data.bot || false;
  }

  public id: string;
  public username: string;
  public globalName: string | null;
  public avatar: string | null;
  public avatarUrl: string;
  public bot: boolean;
  public discriminator: string;

  public toObject(): UserObject {
    return {
      id: this.id,
      username: this.username,
      globalName: this.globalName,
      avatar: this.avatar,
      avatarUrl: this.avatarUrl,
      bot: this.bot,
      discriminator: this.discriminator,
    };
  }
}

export const getUser = cache(async () => {
  const sessionData = await getSessionData();
  if (!sessionData || !sessionData.accessToken) return null;
  return getUserByAccessToken(sessionData.accessToken);
});

export const getUserByAccessToken = cache(async (accessToken: string) => {
  const rest = new REST({ version: "10" }).setToken(accessToken);
  const data = (await rest.get(Routes.user(), {
    auth: true,
    authPrefix: "Bearer",
  })) as RESTGetAPIUserResult | RESTError;
  if (!data || "message" in data) return null;

  return new User(data);
});

export const getUserGuild = cache(async (guildId: string) => {
  const userGuilds = await getUserGuilds();
  if (!userGuilds) return null;

  return userGuilds.find((guild) => guild.id === guildId) || null;
});

export const getUserGuilds = cache(async () => {
  const sessionData = await getSessionData();
  if (!sessionData || !sessionData.accessToken) return null;
  return getUserGuildsByAccessToken(sessionData.accessToken);
});

export const getUserGuildsByAccessToken = cache(async (accessToken: string) => {
  const rest = new REST({ version: "10" }).setToken(accessToken);
  const data = (await rest.get(`${Routes.userGuilds()}?with_counts=true`, {
    auth: true,
    authPrefix: "Bearer",
  })) as RESTGetAPICurrentUserGuildsResult | RESTError;
  if (!data || "message" in data) return null;

  return data.map((guild) => new Guild(guild));
});
