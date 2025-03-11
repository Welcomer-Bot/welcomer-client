import { Collection } from "@discordjs/collection";
import { APIChannel, APIGuild, type RESTAPIPartialCurrentUserGuild, type RESTError, RESTGetAPIGuildChannelsResult, type RESTGetAPIGuildResult, Routes } from "discord-api-types/v10";
import { addGuildToBeta, getGuildBeta, removeGuildToBeta } from "../dal";
import { getGuildBanner, getGuildIcon } from "../utils";
import rest from "./rest";
import { fetchWidget } from "./widget";
const cache = new Collection<string, Guild>();

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
    channels?: APIChannel[];
    beta?: boolean;
}

export default class Guild implements GuildObject {
    constructor(data: APIGuild | RESTAPIPartialCurrentUserGuild) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.iconUrl = getGuildIcon(this);
        this.memberCount = data.approximate_member_count || 0;
        this.banner = data.banner
        this.bannerUrl = getGuildBanner(this);
        this.permissions = data.permissions;
        this.owner = data.owner || false;
        this.channels = [];
        this.mutual = false;
        getGuildBeta(this.id).then(beta => this.beta = !!beta);
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
    public channels?: APIChannel[];
    public channelCache: Collection<string, APIChannel> = new Collection();
    public beta?: boolean | undefined;

    fetchWidget() {
        return fetchWidget(this.id);
    }

    public setMutual(mutual: boolean) {
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
        if (this.channelCache.size) return this.channelCache;
        try {

            const data = await rest.get(Routes.guildChannels(this.id)) as RESTGetAPIGuildChannelsResult | RESTError;
            if (!data || "message" in data) return null;
            for (const channel of data) {
                this.channelCache.set(channel.id, channel);
            }
        } catch (error){
            console.error(error)
        }
        return this.channelCache;
    }

    public async getChannel(channelId: string) {
        const channel = this.channelCache.get(channelId);
        if (channel) return channel;
        await this.getChannels();
        return this.channelCache.get(channelId);
    }

    public async enrollToBetaProgram() {
        return !!await addGuildToBeta(this.id)
    }

    public async removeFromBetaProgram() {
        return !!await removeGuildToBeta(this.id)
    }

    public async leave() {
        return await leaveGuild(this.id)
    }
}

export async function getGuild(guildId: string) {
    const guild = cache.get(guildId);
    if (guild) return guild;

    try {

        const data = await rest.get(`${Routes.guild(guildId)}?with_counts=true`) as RESTGetAPIGuildResult | RESTError;
        if (!data || "message" in data) return null;

        const newGuild = new Guild(data);
        cache.set(guildId, newGuild);

        return newGuild;
    } catch {
        return null;
    }
}

export async function leaveGuild(guildId: string) {
    try {

        const data = await rest.delete(`${Routes.guild(guildId)}`) as RESTGetAPIGuildResult | RESTError;
        if (!data || "message" in data) return null;

        cache.delete(guildId)

        return !!data
    } catch {
        return false;
    }
}