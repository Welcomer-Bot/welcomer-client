import { Collection } from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { type APIUser, type RESTError, type RESTGetAPICurrentUserGuildsResult, type RESTGetAPIUserResult, Routes } from "discord-api-types/v10";
import { getSessionData } from "../dal";
import { getUserAvatar } from "../utils";
import Guild from "./guild";


const cache = new Collection<string, User>();

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
    const user = cache.get(sessionId);
    if (user) return user;
    const sessionData = await getSessionData();
    if (!sessionData) return null;
    const rest = new REST({ version: "10" }).setToken(sessionData.accessToken);
    const data = await rest.get(Routes.user(), { auth: true, authPrefix: "Bearer" }) as RESTGetAPIUserResult | RESTError;
    if (!data || "message" in data) return null;

    const newUser = new User(data);
    cache.set(sessionId, newUser);

    return newUser;
}

export async function getUserGuild(guildId: string) {
    const userGuilds = await getUserGuilds()
    if (!userGuilds) return null;
    return userGuilds.find(guild => guild.id === guildId);

}

export async function getUserGuilds() {
    const sessionData = await getSessionData();
    if (!sessionData) return null;
    const rest = new REST({ version: "10" }).setToken(sessionData.accessToken);
    const data = await rest.get(Routes.userGuilds(), { auth: true, authPrefix: "Bearer" }) as RESTGetAPICurrentUserGuildsResult | RESTError;
    if (!data || "message" in data) return null;

    return data.map(guild => new Guild(guild));
}


