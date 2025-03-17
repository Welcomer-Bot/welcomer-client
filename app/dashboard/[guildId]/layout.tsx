import { redirect } from "next/navigation";
import React from "react";

import { Sidebar } from "@/components/dashboard/guild/sideBar";
import { fetchUserFromSession, getGuilds } from "@/lib/dal";
import { getGuild } from "@/lib/discord/guild";
import { getUserGuild } from "@/lib/discord/user";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    guildId: string;
    module: string;
  }>;
}) {
  const user = await fetchUserFromSession();
  if (!user) redirect("/dashboard");
  const { guildId } = await params;
  const userGuild = await getUserGuild(guildId);
  if (!userGuild) redirect("/dashboard");

  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");

  const otherGuilds =
    (await getGuilds())?.filter((g) => g.id !== userGuild.id) ?? [];
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar
        currentGuild={userGuild.toObject()}
        guilds={otherGuilds.map((guild) => guild.toObject())}
        user={user.toObject()}
      />
      <div className="w-full h-screen overflow-y-visible overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
