"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDoorOpen, FaHome } from "react-icons/fa";
import { ImEnter } from "react-icons/im";
import { MdDashboard } from "react-icons/md";

import { GuildObject } from "@/lib/discord/guild";
import { SidebarItem } from "./sidebarItem";

interface SidebarNavigationProps {
  currentGuild: GuildObject;
}

export function SidebarNavigation({ currentGuild }: SidebarNavigationProps) {
  const pathname = usePathname();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    const activeSegment = pathname
      ? (pathname.split("/")[3] ?? "dashboard")
      : "dashboard";
    setActive(activeSegment);
  }, [pathname]);

  return (
    <ul className="sm:flex-1 sm:block flex flex-row justify-evenly w-full px-3">
      <SidebarItem
        active={active === "home"}
        icon={<FaHome />}
        link="/dashboard"
        text="Home"
      />
      <SidebarItem
        active={active === "dashboard"}
        icon={<MdDashboard />}
        link={`/dashboard/${currentGuild.id}`}
        text="Dashboard"
      />
      <SidebarItem
        active={active === "welcome"}
        icon={<ImEnter />}
        link={`/dashboard/${currentGuild.id}/welcome`}
        text="Welcomer"
      />
      <SidebarItem
        active={active === "leave"}
        icon={<FaDoorOpen />}
        link={`/dashboard/${currentGuild.id}/leave`}
        text="Leaver"
      />
    </ul>
  );
}
