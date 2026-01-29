"server-only";

import { type APIUser } from "discord-api-types/v10";
import { getUserAvatar } from "../utils";

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
