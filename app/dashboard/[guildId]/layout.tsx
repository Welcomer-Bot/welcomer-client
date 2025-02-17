import { redirect } from "next/navigation";
import React from "react";

import { Sidebar } from "@/components/dashboard/guild/sideBar";
import { getGuild, getGuilds, getUserData, getUserGuild } from "@/lib/dal";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    guildId: string;
  }>;
}) {
  const { guildId } = await params;
  const userGuild = await getUserGuild(guildId);
  if (!userGuild) redirect("/dashboard");

  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");

  const otherGuilds =
    (await getGuilds())?.filter((g) => g.id !== userGuild.id) ?? [];
  const user = await getUserData();

  return (
    <div className="flex h-full w-full  overflow-hidden">
      <Sidebar currentGuild={userGuild} guilds={otherGuilds} user={user!} />
      <div className="w-full h-screen">{children}</div>
    </div>
  );
}
