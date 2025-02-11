import { ModuleName } from "@/types";
import { Period } from "@prisma/client";
import "server-only";
import { getGuildStats } from "./dal";


export async function fetchGuildStats(guildId: string, type: ModuleName) {
    const res = []
    for (const period of Object.values(Period)) {
        res.push(await getGuildStats(guildId, period, type));
    }
    return res;
}