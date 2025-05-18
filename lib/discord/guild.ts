"server-only";

import {
  APIChannel,
  APIGuild,
  APITextChannel,
  RESTAPIPartialCurrentUserGuild,
} from "discord-api-types/v10";
import {
  addGuildToBeta,
  getBot,
  getChannels,
  getGuildBeta,
  getMemberPermissions,
  getRolesPermissions,
  isPremiumGuild,
  leaveGuild,
  removeGuildToBeta,
} from "../dal";
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
  premium?: boolean;
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

    for (const channel of this.channels) {
      const perms = await this.getChannelsPermissions(channel.id);
      console.log(channel.name + ": " + perms, "read messages", hasPermission(perms, Permissions.VIEW_CHANNEL), "send messages", hasPermission(perms, Permissions.SEND_MESSAGES), "attach files", hasPermission(perms, Permissions.ATTACH_FILES));
    }
    return this.channels;
  }

  public async getChannel(channelId: string) {
    await this.getChannels();
    return this.channels?.find((channel) => channel.id === channelId) || null;
  }

  public async getPermissions() {
    return await getMemberPermissions(this.id);
  }

  public async getChannelsPermissions(channelId: string) {
    let permissions = BigInt(0);
    const roles = await getRolesPermissions(this.id) ?? [];
    const member = await getBot(this.id);
    if (!member) return BigInt(0);
    const everyoneRole = roles.find((r) => r.id === this.id); // @everyone

    if (everyoneRole) permissions |= BigInt(everyoneRole.permissions);

    for (const roleId of member?.roles ?? []) {
      const role = roles.find((r) => r.id === roleId);
      if (role) permissions |= BigInt(role.permissions);
    }

    if (hasPermission(permissions, Permissions.ADMINISTRATOR)) {
      return BigInt("0xFFFFFFFFFFFFFFFF"); // Toutes les permissions (53 bits)
    }

    let allow = BigInt(0),
      deny = BigInt(0);
    // a. Overwrite @everyone
    const channel = this.channels.find(
      (c) => c.id === channelId
    ) as APITextChannel;
    if (!channel) return BigInt(0);
    const overwriteEveryone = (channel.permission_overwrites ?? []).find(
      (ow) => ow.id === this.id && ow.type === 0
    );
    if (overwriteEveryone) {
      deny |= BigInt(overwriteEveryone.deny);
      allow |= BigInt(overwriteEveryone.allow);
    }

    // b. Overwrites des rôles (somme tous les allow/deny des rôles du membre)
    for (const roleId of member.roles) {
      const ow = (channel.permission_overwrites ?? []).find(
        (ow) => ow.id === roleId && ow.type === 0
      );
      if (ow) {
        deny |= BigInt(ow.deny);
        allow |= BigInt(ow.allow);
      }
    }

    // c. Overwrite utilisateur
    const overwriteUser = (channel.permission_overwrites ?? []).find(
      (ow) => ow.id === member.user.id && ow.type === 1
    );
    if (overwriteUser) {
      deny |= BigInt(overwriteUser.deny);
      allow |= BigInt(overwriteUser.allow);
    }

    // Appliquer deny puis allow
    permissions = (permissions & ~deny) | allow;

    return permissions;
  }

  public async enrollToBetaProgram() {
    this.beta = true;
    return await addGuildToBeta(this.id);
  }

  public async removeFromBetaProgram() {
    this.beta = false;
    return await removeGuildToBeta(this.id);
  }

  public async leave() {
    return await leaveGuild(this.id);
  }
}

const Permissions = {
  ADMINISTRATOR: BigInt(1) << BigInt(3),
  SEND_MESSAGES: BigInt(1) << BigInt(11),
  VIEW_CHANNEL: BigInt(1) << BigInt(10),
  ATTACH_FILES: BigInt(1) << BigInt(15),
};

function hasPermission(permissions: bigint, flag: bigint) {
  return (permissions & flag) === flag;
}
