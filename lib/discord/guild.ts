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
  channels: (APIChannel & {
    permissions: number;
  })[];
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
  public channels: (APIChannel & {
    permissions: number;
  })[];
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
    const channels = (await getChannels(this.id)) as (APIChannel & {
      permissions: number;
    })[];
    if (channels) {
      this.channels = channels;
      for (const channel of channels) {
        channel.permissions = await this.getChannelsPermissions(channel.id);
      }
    }
    // console.log(
    //   "requiredPermissions",
    //   RequiredPermissions,
    //   "hasPermission",
    //   hasPermission(Number(this.permissions ?? 0), RequiredPermissions)
    // );

    for (const channel of this.channels) {
      console.log(
        channel.name + ": " + channel.permissions,
        "read messages",
        hasPermission(channel.permissions, Permissions.VIEW_CHANNEL),
        "send messages",
        hasPermission(channel.permissions, Permissions.SEND_MESSAGES),
        "attach files",
        hasPermission(channel.permissions, Permissions.ATTACH_FILES)
      );
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
    let permissions = 0;
    const roles = (await getRolesPermissions(this.id)) ?? [];
    const member = await getBot(this.id);
    if (!member) return 0;
    const everyoneRole = roles.find((r) => r.id === this.id); // @everyone

    if (everyoneRole) permissions |= Number(everyoneRole.permissions);

    for (const roleId of member?.roles ?? []) {
      const role = roles.find((r) => r.id === roleId);
      if (role) permissions |= Number(role.permissions);
    }

    if (hasPermission(permissions, Permissions.ADMINISTRATOR)) {
      return 0xffffffff; // Toutes les permissions (32 bits)
    }

    let allow = 0,
      deny = 0;
    // a. Overwrite @everyone
    const channel = this.channels.find(
      (c) => c.id === channelId
    ) as APITextChannel;
    if (!channel) return 0;
    const overwriteEveryone = (channel.permission_overwrites ?? []).find(
      (ow) => ow.id === this.id && ow.type === 0
    );
    if (overwriteEveryone) {
      deny |= Number(overwriteEveryone.deny);
      allow |= Number(overwriteEveryone.allow);
    }

    // b. Overwrites des rôles (somme tous les allow/deny des rôles du membre)
    for (const roleId of member.roles) {
      const ow = (channel.permission_overwrites ?? []).find(
        (ow) => ow.id === roleId && ow.type === 0
      );
      if (ow) {
        deny |= Number(ow.deny);
        allow |= Number(ow.allow);
      }
    }

    // c. Overwrite utilisateur
    const overwriteUser = (channel.permission_overwrites ?? []).find(
      (ow) => ow.id === member.user.id && ow.type === 1
    );
    if (overwriteUser) {
      deny |= Number(overwriteUser.deny);
      allow |= Number(overwriteUser.allow);
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
  ADMINISTRATOR: 1 << 3,
  SEND_MESSAGES: 1 << 11,
  VIEW_CHANNEL: 1 << 10,
  ATTACH_FILES: 1 << 15,
};

export const RequiredPermissions = [
  Permissions.SEND_MESSAGES,
  Permissions.VIEW_CHANNEL,
  Permissions.ATTACH_FILES,
].reduce((acc, perm) => acc | perm, 0);

export function hasRequiredPermissions(permissions: number) {
  return (
    hasPermission(permissions, Permissions.ADMINISTRATOR) ||
    hasPermission(permissions, RequiredPermissions)
  );
}

export function hasPermission(
  permissions: number | undefined | null,
  flag: number | undefined | null
) {
  if (permissions === undefined || permissions === null) permissions = 0;
  if (flag === undefined || flag === null) flag = 0;
  return (permissions & flag) === flag;
}
