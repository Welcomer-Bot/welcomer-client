import { Divider } from "@heroui/divider";
import { Suspense } from "react";

import { GuildObject } from "@/lib/discord/guild";
import { UserObject } from "@/lib/discord/user";
import { GuildCardSkeleton } from "./guildCard";
import { GuildSelectDropdownServer } from "./guildSelectDropdownServer";
import { SidebarHeader } from "./sidebarHeader";
import { SidebarNavigation } from "./sidebarNavigation";
import {
  SidebarNavigationSkeleton,
  SidebarSkeleton,
  SidebarUserSkeleton,
} from "./sidebarSkeleton";
import { SidebarUser } from "./sidebarUser";

interface SidebarServerProps {
  currentGuild: GuildObject;
  guilds: GuildObject[];
  user: UserObject;
}

export function SidebarServer({
  currentGuild,
  guilds,
  user,
}: SidebarServerProps) {
  return (
    <aside className="sm:h-screen h-fit z-30 sm:sticky sm:w-auto w-full bottom-0">
      <nav className="sm:h-full flex flex-row sm:flex-col bg-slate-800 border-r border-slate-700 shadow-sm sm:py-0 py-2 rounded-t-md sm:rounded-t-none">
        <Suspense fallback={<SidebarSkeleton />}>
          <SidebarContent
            currentGuild={currentGuild}
            guilds={guilds}
            user={user}
          />
        </Suspense>
      </nav>
    </aside>
  );
}

async function SidebarContent({
  currentGuild,
  guilds,
  user,
}: SidebarServerProps) {
  return (
    <>
      {/* Header - no suspense needed, it's static */}
      <SidebarHeader />
      <Divider className="mb-2 sm:block hidden" />

      {/* Guild selector with its own skeleton */}
      <Suspense
        fallback={
          <div className="m-2">
            <GuildCardSkeleton />
          </div>
        }
      >
        <GuildSelectDropdownServer
          currentGuild={currentGuild}
          guilds={guilds}
        />
      </Suspense>

      <Divider className="mb-2 sm:block hidden" />

      {/* Navigation with dedicated skeleton */}
      <Suspense fallback={<SidebarNavigationSkeleton />}>
        <SidebarNavigation currentGuild={currentGuild} />
      </Suspense>

      <Divider className="sm:block hidden" />

      {/* User section with dedicated skeleton */}
      <Suspense fallback={<SidebarUserSkeleton />}>
        <SidebarUser user={user} />
      </Suspense>
    </>
  );
}
