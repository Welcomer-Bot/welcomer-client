import { Collection } from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { type APIUser, type RESTError, type RESTGetAPICurrentUserGuildsResult, type RESTGetAPIUserResult, Routes } from "discord-api-types/v10";
import { getSessionData } from "../dal";
import { getUserAvatar } from "../utils";
import Guild, { guildCache } from "./guild";


const userCache = new Collection<string, User>();

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

export async function getUser(sessionId: string) {
    const user = userCache.get(sessionId);
    if (user) return user;
    const sessionData = await getSessionData();
    if (!sessionData) return null;
    const rest = new REST({ version: "10" }).setToken(sessionData.accessToken);
    const data = await rest.get(Routes.user(), { auth: true, authPrefix: "Bearer" }) as RESTGetAPIUserResult | RESTError;
    if (!data || "message" in data) return null;

    const newUser = new User(data);
    userCache.set(sessionId, newUser);

    return newUser;
}

export async function getUserByAccessToken(accessToken: string) {
    const rest = new REST({ version: "10" }).setToken(accessToken);
    const data = await rest.get(Routes.user(), { auth: true, authPrefix: "Bearer" }) as
        RESTGetAPIUserResult | RESTError;
    if (!data || "message" in data) return null;

    return new User(data);
}
// TODO: implement cache
export async function getUserGuild(guildId: string) {
    const guilds = guildCache.get(guildId);
    if (guilds) return guilds;
    const userGuilds = await getUserGuilds()
    if (!userGuilds) return null;

    for (const guild of userGuilds) {
        guildCache.set(guild.id, guild);
    }
    return guildCache.get(guildId);
}

export async function getUserGuilds() {

    const sessionData = await getSessionData();
    if (!sessionData) return null;
    try {

        const rest = new REST({ version: "10" }).setToken(sessionData.accessToken);
        const data = await rest.get(`${Routes.userGuilds()}?with_counts=true`, { auth: true, authPrefix: "Bearer" }) as RESTGetAPICurrentUserGuildsResult | RESTError;
        if (!data || "message" in data) return null;

        return data.map(guild => new Guild(guild));
    } catch {
        return null;
    }
}

export async function getUserGuildsByAccessToken(accessToken: string) {
    const rest = new REST({ version: "10" }).setToken(accessToken);
    const data = await rest.get(`${Routes.userGuilds()}?with_counts=true`, { auth: true, authPrefix: "Bearer" }) as RESTGetAPICurrentUserGuildsResult | RESTError;
    if (!data || "message" in data) return null;

    return data.map(guild => new Guild(guild));
}

