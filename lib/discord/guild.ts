import {
  APIChannel,
  APIGuild,
  type RESTAPIPartialCurrentUserGuild,
  type RESTError,
  RESTGetAPIGuildChannelsResult,
  type RESTGetAPIGuildResult,
  Routes,
} from "discord-api-types/v10";
import { cache } from "react";
import { addGuildToBeta, getGuildBeta, removeGuildToBeta } from "../dal";
import { getGuildBanner, getGuildIcon } from "../utils";
import rest from "./rest";
import { fetchWidget } from "./widget";

export type GuildObject = {
  id: string;
  name: string;
  icon: string | null;
  iconUrl: string | null;
  memberCount: number;
  banner: string | null;
  bannerUrl: string;
  mutual: boolean;
  permissions?: string;
  owner?: boolean;
  channels: APIChannel[];
  beta?: boolean;
};

export default class Guild implements GuildObject {
  constructor(data: APIGuild | RESTAPIPartialCurrentUserGuild) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.iconUrl = getGuildIcon(this);
    this.memberCount = data.approximate_member_count || 0;
    this.banner = data.banner;
    this.bannerUrl = getGuildBanner(this);
    this.permissions = data.permissions;
    this.owner = data.owner || false;
    this.channels = [];
    this.mutual = false;
    getGuildBeta(this.id).then((beta) => (this.beta = !!beta));
  }

  public id: string;
  public name: string;
  public icon: string | null;
  public iconUrl: string | null;
  public memberCount: number;
  public banner: string | null;
  public bannerUrl: string;
  public mutual: boolean;
  public permissions?: string;
  public owner?: boolean;
  public channels: APIChannel[];
  public beta?: boolean | undefined;

  fetchWidget() {
    return fetchWidget(this.id);
  }

  public async setMutual(mutual: boolean) {
    this.mutual = mutual;
  }

  public toObject(): GuildObject {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      iconUrl: this.iconUrl,
      memberCount: this.memberCount,
      banner: this.banner,
      bannerUrl: this.bannerUrl,
      mutual: this.mutual,
      permissions: this.permissions,
      owner: this.owner,
      channels: this.channels,
      beta: this.beta,
    };
  }

  public async getChannels() {
    const channels = await getChannels(this.id);
    if (channels) {
      this.channels = channels;
    }
    return this.channels;
  }

  public async getChannel(channelId: string) {
    await this.getChannels();
    return this.channels?.find((channel) => channel.id === channelId) || null;
  }

  public async enrollToBetaProgram() {
    this.beta = true;
    return !!(await addGuildToBeta(this.id));
  }

  public async removeFromBetaProgram() {
    this.beta = false;
    return !!(await removeGuildToBeta(this.id));
  }

  public async leave() {
    return !!(await leaveGuild(this.id));
  }
}

export const getGuild = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      `${Routes.guild(guildId)}?with_counts=true`
    )) as RESTGetAPIGuildResult | RESTError;
    if (!data || "message" in data) return null;

    const guild = new Guild(data);

    return guild;
  } catch {
    return null;
  }
});

export const leaveGuild = cache(async (guildId: string) => {
  try {
    const data = (await rest.delete(`${Routes.userGuild(guildId)}`)) as
      | RESTGetAPIGuildResult
      | RESTError;
    if (!data || "message" in data) return null;

    return !!data;
  } catch {
    return false;
  }
});

export const getChannels = cache(async (guildId: string) => {
  try {
    const data = (await rest.get(
      `${Routes.guildChannels(guildId)}?with_counts=true`
    )) as RESTGetAPIGuildChannelsResult | RESTError;
    if (!data || "message" in data) return null;

    return data;
  } catch {
    return null;
  }
});
