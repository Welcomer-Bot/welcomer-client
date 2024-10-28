import { redirect } from "next/navigation";
import React from "react";

import { Sidebar } from "@/components/dashboard/guild/sideBar";
import { getUserData, getUserGuild, getUserGuilds } from "@/lib/dal";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    guildId: string;
  };
}) {
  const { guildId } = await params;
  const guild = await getUserGuild(guildId);

  if (!guild) redirect("/dashboard");
  const otherGuilds =
    (await getUserGuilds())?.filter((g) => g.id !== guild.id) ?? [];
  const user = await getUserData();

  return (
    <div className="flex flex-row h-screen">
      <Sidebar currentGuild={guild} guilds={otherGuilds} user={user!} />
      <main className="flex justify-center h-fit mx-auto overflow-y flex-grow ml-[72px] py-5 px-6">
        {children}
      </main>
    </div>
  );
}
