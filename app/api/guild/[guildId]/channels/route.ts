import { canUserManageGuild, getGuildChannels } from "@/lib/dal";

export async function GET(request: Request, {params}: {params: Promise<{guildId: string}>}) {
    const guildId = (await params).guildId;
    const isAuthorized = await canUserManageGuild(guildId);
    if (!isAuthorized) {
        return new Response("Unauthorized", {status: 401});
    }
    const channels = await getGuildChannels(guildId);
    return new Response(JSON.stringify(channels), {status: 200});
}
