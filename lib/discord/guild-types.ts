import { APIChannel } from "discord-api-types/v10";

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
        permissions: bigint;
    })[];
    beta?: boolean;
    premium?: boolean;
};

export const Permissions = {
    ADMINISTRATOR: 1n << 3n,
    SEND_MESSAGES: 1n << 11n,
    VIEW_CHANNEL: 1n << 10n,
    ATTACH_FILES: 1n << 15n,
};

export const RequiredPermissions = [
    Permissions.SEND_MESSAGES,
    Permissions.VIEW_CHANNEL,
    Permissions.ATTACH_FILES,
].reduce((acc, perm) => acc | perm, 0n);

export function hasRequiredPermissions(
    permissions: bigint | number | undefined | null,
) {
    if (permissions === undefined || permissions === null) permissions = 0n;
    permissions =
        typeof permissions === "bigint" ? permissions : BigInt(permissions);
    if (hasPermission(permissions, Permissions.ADMINISTRATOR)) return true;
    return (permissions & RequiredPermissions) === RequiredPermissions;
}

export function hasPermission(
    permissions: bigint | number | undefined | null,
    flag: bigint | number | undefined | null,
) {
    if (permissions === undefined || permissions === null) permissions = 0n;
    if (flag === undefined || flag === null) flag = 0n;
    permissions =
        typeof permissions === "bigint" ? permissions : BigInt(permissions);
    flag = typeof flag === "bigint" ? flag : BigInt(flag);
    return (permissions & flag) === flag;
}
