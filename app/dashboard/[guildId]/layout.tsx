import { redirect } from "next/navigation";
import React from "react";

import { Sidebar } from "@/components/dashboard/guild/sideBar";
import {
  fetchUserFromSession,
  getGuild,
  getGuilds,
  getUserGuild,
} from "@/lib/dal";

type Params = Promise<{ guildId: string; module: string }>;

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
  let userGuild = await getUserGuild(guildId);
  //TODO: add user admin schema
  if (user.id == "479216487173980160") {
    userGuild = await getGuild(guildId);
  }

  if (!userGuild) redirect("/dashboard");

  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");

  const otherGuilds =
    (await getGuilds())?.filter((g) => g.id !== userGuild.id) ?? [];
  return (
    <div className="flex h-full w-full sm:flex-row flex-col-reverse overflow-hidden">
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
