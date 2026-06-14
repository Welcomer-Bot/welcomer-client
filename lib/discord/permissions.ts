const MANAGE_GUILD = 0x20;

type GuildPermissionFields = {
  owner?: boolean;
  permissions?: string | number | bigint | null;
};

export function canManageGuild(guild: GuildPermissionFields): boolean {
  return Boolean(
    guild.owner ||
      (guild.permissions &&
        (Number(guild.permissions) & MANAGE_GUILD) === MANAGE_GUILD),
  );
}
