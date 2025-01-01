import { redirect } from "next/navigation";
import React from "react";

import { Sidebar } from "@/components/dashboard/guild/sideBar";
import { getUserData, getUserGuild, getUserGuilds } from "@/lib/dal";

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
  const guild = await getUserGuild(guildId);

  if (!guild) redirect("/dashboard");
  const otherGuilds =
    (await getUserGuilds())?.filter((g) => g.id !== guild.id) ?? [];
  const user = await getUserData();

  return (
    <div className="flex h-full w-full">
      <Sidebar currentGuild={guild} guilds={otherGuilds} user={user!} />
      <div className="flex justify-center mx-auto flex-grow h-full ml-20 sm:ml-0">
        {children}
      </div>
    </div>
  );
}
