import { canUserManageGuild, getGuildChannels } from "@/lib/dal";
import { fetchGuildStat } from "@/lib/dto";
import { ModuleName } from "@/types";
import { Period } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{guildId: string}>}) {
    const { guildId } = (await params);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") as Period;
    const moduleName = searchParams.get("moduleName") as ModuleName;
    if (!guildId || !period || !Object.values(Period).includes(period as Period) || !moduleName || !["welcomer", "leaver"].includes(moduleName)) return new Response("Bad request", { status: 400 });
    const isAuthorized = await canUserManageGuild(guildId);
    if (!isAuthorized) {
        return new Response("Unauthorized", {status: 401});
    }
    const stats = await fetchGuildStat(guildId, period, moduleName);
    return new Response(JSON.stringify(stats), {status: 200});
}
