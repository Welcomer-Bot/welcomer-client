import { canUserManageGuild, getEmbeds, getWelcomer } from "@/lib/dal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const guildId = (await params).guildId;
  const isAuthorized = await canUserManageGuild(guildId);
  if (!isAuthorized) {
    return new Response("Unauthorized", { status: 401 });
  }
  const welcomer = await getWelcomer(guildId);
  if (!welcomer) return new Response("Welcomer not found", { status: 404 });
  const embeds = await getEmbeds(welcomer?.id);
  return new Response(JSON.stringify(embeds), { status: 200 });
}
