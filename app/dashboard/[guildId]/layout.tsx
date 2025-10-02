import { redirect } from "next/navigation";
import React from "react";

import { Sidebar } from "@/components/dashboard/guild/sideBar";
import Footer from "@/components/Footer";
import {
  fetchUserFromSession,
  getGuild,
  getGuilds,
  getUserGuild,
} from "@/lib/dal";

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
  const userGuild = await getUserGuild(guildId);
  if (!userGuild) redirect("/dashboard");

  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");

  const otherGuilds =
    (await getGuilds())?.filter((g) => g.id !== userGuild.id) ?? [];
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
