import { Divider } from "@heroui/divider";
import { Suspense } from "react";

import { fetchUserFromSession, getGuilds, getUserGuild } from "@/lib/dal";
import { GuildCardSkeleton } from "./guildCard";
import { GuildSelectDropdownServer } from "./guildSelectDropdownServer";
import { SidebarHeader } from "./sidebarHeader";
import { SidebarNavigation } from "./sidebarNavigation";
import {
  SidebarNavigationSkeleton,
  SidebarUserSkeleton,
} from "./sidebarSkeleton";
import { SidebarUser } from "./sidebarUser";

interface StreamingSidebarProps {
  guildId: string;
}

export function StreamingSidebar({ guildId }: StreamingSidebarProps) {
  return (
    <aside className="sm:h-screen h-fit z-30 sm:sticky sm:w-auto w-full bottom-0">
      <nav className="sm:h-full flex flex-row sm:flex-col bg-slate-800 border-r border-slate-700 shadow-sm sm:py-0 py-2 rounded-t-md sm:rounded-t-none">
        {/* Header loads immediately - no async deps */}
        <SidebarHeader />
        <Divider className="mb-2 sm:block hidden" />

        {/* Guild selector loads with guilds data */}
        <Suspense fallback={<GuildSelectorSkeleton />}>
          <GuildSelectorWithData guildId={guildId} />
        </Suspense>

        <Divider className="mb-2 sm:block hidden" />

        {/* Navigation loads with current guild data */}
        <Suspense fallback={<SidebarNavigationSkeleton />}>
          <NavigationWithData guildId={guildId} />
        </Suspense>

        <Divider className="sm:block hidden" />

        {/* User section loads with user data */}
        <Suspense fallback={<SidebarUserSkeleton />}>
          <UserWithData />
        </Suspense>
      </nav>
    </aside>
  );
}

async function GuildSelectorWithData({ guildId }: { guildId: string }) {
  const [userGuild, guilds] = await Promise.all([
    getUserGuild(guildId),
    getGuilds().then((guilds) => guilds?.filter((g) => g.id !== guildId) ?? []),
  ]);

  if (!userGuild) return <GuildSelectorSkeleton />;

  return (
    <GuildSelectDropdownServer
      currentGuild={userGuild.toObject()}
      guilds={guilds.map((guild) => guild.toObject())}
    />
  );
}

async function NavigationWithData({ guildId }: { guildId: string }) {
  const userGuild = await getUserGuild(guildId);

  if (!userGuild) return <SidebarNavigationSkeleton />;

  return <SidebarNavigation currentGuild={userGuild.toObject()} />;
}

async function UserWithData() {
  const user = await fetchUserFromSession();

  if (!user) return <SidebarUserSkeleton />;

  return <SidebarUser user={user.toObject()} />;
}

function GuildSelectorSkeleton() {
  return (
    <div className="m-2">
      <GuildCardSkeleton />
    </div>
  );
}
