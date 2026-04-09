import { redirect } from "next/navigation";
import React from "react";

import { Footer, Sidebar } from "@/components/layout";
import { getGuild } from "@/lib/dal/discord";
import { fetchUserFromSession, getGuilds, getUserGuild } from "@/lib/dal/session";

type Params = Promise<{ guildId: string }>;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const user = await fetchUserFromSession();
  if (!user) redirect("/dashboard");
  const { guildId } = await params;

  // Parallel data fetching for better performance
  const [userGuild, guild, allGuilds] = await Promise.all([
    getUserGuild(guildId),
    getGuild(guildId),
    getGuilds(),
  ]);

  if (!userGuild || !guild) redirect("/dashboard");

  const otherGuilds = allGuilds?.filter((g) => g.id !== userGuild.id) ?? [];

  return (
    <div className="flex h-screen w-full sm:flex-row flex-col-reverse overflow-hidden">
      <Sidebar
        currentGuild={userGuild.toObject()}
        guilds={otherGuilds.map((guild) => guild.toObject())}
        user={user.toObject()}
      />
      <div className="w-full h-full overflow-y-visible overflow-x-hidden">
        {children}
        <Footer />
      </div>
    </div>
  );
}
