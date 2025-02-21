import { getUser, getUserById, getGuildsByUserId } from "@/lib/dal";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    const userId = (await params).userId;
    if (!userId) return new Response("Bad Request", { status: 400 });
    const user = await getUser()
    if (!user || user.id !== "479216487173980160") return new Response("Unauthorized", { status: 401 });
    const userGuilds = await getGuildsByUserId(userId);
    const targetUser = await getUserById(userId)
    return new Response(JSON.stringify({ ...targetUser, guilds: userGuilds }), { status: 200 });

}
