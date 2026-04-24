import {APIChannel, APIGuild, APITextChannel, RESTAPIPartialCurrentUserGuild,} from "discord-api-types/v10";
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
import {getGuildBanner, getGuildIcon} from "../utils";
import {fetchWidget} from "./widget";
import {GuildObject, Permissions, hasPermission} from "./guild-types";

export type {GuildObject} from "./guild-types";
export {Permissions, RequiredPermissions, hasPermission, hasRequiredPermissions} from "./guild-types";

export default class Guild implements GuildObject {
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
        permissions: bigint;
    })[];
    public beta?: boolean | undefined;
    public premium?: boolean;

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
            permissions: bigint;
        })[];
        if (!channels) return [];
        this.channels = channels;
        // Calculer les permissions pour chaque channel de façon asynchrone
        this.channels = await Promise.all(
            channels.map(async (channel) => {
                const perms = await this.getChannelsPermissions(channel.id);
                return {...channel, permissions: perms};
            }),
        );
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
        let permissions = 0n;
        const roles = (await getRolesPermissions(this.id)) ?? [];
        const member = await getBot(this.id);
        if (!member) return 0n;
        const everyoneRole = roles.find((r) => r.id === this.id); // @everyone
        if (everyoneRole) permissions |= BigInt(everyoneRole.permissions);
        for (const roleId of member?.roles ?? []) {
            const role = roles.find((r) => r.id === roleId);
            if (role) permissions |= BigInt(role.permissions);
        }
        if (hasPermission(permissions, Permissions.ADMINISTRATOR)) {
            return 0xffffffffffffffffn; // Toutes les permissions (64 bits)
        }
        // S'assurer que les channels sont chargés
        if (!this.channels || this.channels.length === 0) {
            await this.getChannels();
        }
        let allow = 0n,
            deny = 0n;
        // a. Overwrite @everyone
        const channel = this.channels.find(
            (c) => c.id === channelId,
        ) as APITextChannel;
        if (!channel) return permissions;
        const overwriteEveryone = (channel.permission_overwrites ?? []).find(
            (ow) => ow.id === this.id && ow.type === 0,
        );
        if (overwriteEveryone) {
            deny |= BigInt(overwriteEveryone.deny);
            allow |= BigInt(overwriteEveryone.allow);
        }
        // b. Overwrites des rôles (somme tous les allow/deny des rôles du membre)
        for (const roleId of member.roles) {
            const ow = (channel.permission_overwrites ?? []).find(
                (ow) => ow.id === roleId && ow.type === 0,
            );
            if (ow) {
                deny |= BigInt(ow.deny);
                allow |= BigInt(ow.allow);
            }
        }
        // c. Overwrite utilisateur
        const overwriteUser = (channel.permission_overwrites ?? []).find(
            (ow) => ow.id === member.user.id && ow.type === 1,
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

