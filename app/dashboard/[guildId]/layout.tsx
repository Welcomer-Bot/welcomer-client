import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import {
  SidebarSkeleton,
  StreamingSidebar,
} from "@/components/dashboard/guild/sidebar";
import Footer from "@/components/Footer";
import { fetchUserFromSession, getGuild, getUserGuild } from "@/lib/dal";

type Params = Promise<{ guildId: string; module: string }>;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  // Only do essential auth checks here, let StreamingSidebar handle the data fetching
  const user = await fetchUserFromSession();
  if (!user) redirect("/dashboard");

  const { guildId } = await params;
  const userGuild = await getUserGuild(guildId);
  if (!userGuild) redirect("/dashboard");

  const guild = await getGuild(guildId);
  if (!guild) redirect("/dashboard");

  return (
    <div className="flex h-screen w-full sm:flex-row flex-col-reverse overflow-hidden">
      <Suspense fallback={<SidebarFallback />}>
        <StreamingSidebar guildId={guildId} />
      </Suspense>
      <div className="w-full h-full overflow-y-visible overflow-x-hidden">
        {children}
        <Footer />
      </div>
    </div>
  );
}

function SidebarFallback() {
  return (
    <aside className="sm:h-screen h-fit z-30 sm:sticky sm:w-auto w-full bottom-0">
      <nav className="sm:h-full flex flex-row sm:flex-col bg-slate-800 border-r border-slate-700 shadow-sm sm:py-0 py-2 rounded-t-md sm:rounded-t-none">
        <SidebarSkeleton />
      </nav>
    </aside>
  );
}
