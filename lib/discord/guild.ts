"server-only";

import { APIChannel, APIGuild, RESTAPIPartialCurrentUserGuild } from "discord-api-types/v10";
import { addGuildToBeta, getChannels, getGuildBeta, isPremiumGuild, leaveGuild, removeGuildToBeta } from "../dal";
import { getGuildBanner, getGuildIcon } from "../utils";
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
  premium?: boolean
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
    isPremiumGuild(this.id).then((premium) => (this.premium = premium));
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
  public premium?: boolean;

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
      premium: this.premium,
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
