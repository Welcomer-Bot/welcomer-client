import { Suspense } from "react";

import {
  fetchUserFromSession,
  getGuild,
  getGuilds,
  getUserGuild,
} from "@/lib/dal";
import { SidebarServer } from "./sidebarServer";
import { SidebarSkeleton } from "./sidebarSkeleton";

interface SidebarWrapperProps {
  guildId: string;
}

export function SidebarWrapper({ guildId }: SidebarWrapperProps) {
  return (
    <Suspense fallback={<SidebarSkeletonWrapper />}>
      <SidebarWithData guildId={guildId} />
    </Suspense>
  );
}

async function SidebarWithData({ guildId }: SidebarWrapperProps) {
  // These are all cached and will be resolved in parallel
  const [user, userGuild, guild, otherGuilds] = await Promise.all([
    fetchUserFromSession(),
    getUserGuild(guildId),
    getGuild(guildId),
    getGuilds().then((guilds) => guilds?.filter((g) => g.id !== guildId) ?? []),
  ]);

  // These checks should be handled at the layout level, but adding them here for safety
  if (!user || !userGuild || !guild) {
    return <SidebarSkeletonWrapper />;
  }

  return (
    <SidebarServer
      currentGuild={userGuild.toObject()}
      guilds={otherGuilds.map((guild) => guild.toObject())}
      user={user.toObject()}
    />
  );
}

function SidebarSkeletonWrapper() {
  return (
    <aside className="sm:h-screen h-fit z-30 sm:sticky sm:w-auto w-full bottom-0">
      <nav className="sm:h-full flex flex-row sm:flex-col bg-slate-800 border-r border-slate-700 shadow-sm sm:py-0 py-2 rounded-t-md sm:rounded-t-none">
        <SidebarSkeleton />
      </nav>
    </aside>
  );
}
