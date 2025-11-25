"use client";

import { GuildSelectDropdown } from "@/components/dashboard/guild/guild-select-dropdown";
import { LogoutIcon } from "@/components/dashboard/guild/logout-icon";
import { Divider } from "@heroui/divider";
import { User as UIUser } from "@heroui/user";
import Link from "next/link";
import { FaDoorOpen, FaHome } from "react-icons/fa";
import { ImEnter } from "react-icons/im";
import { MdDashboard } from "react-icons/md";

import { SidebarContext } from "@/app/providers";
import { Logo } from "@/components/ui/icons/icons";
import { GuildObject } from "@/lib/discord/guild";
import { UserObject } from "@/lib/discord/user";
import { useSelectedLayoutSegment } from "next/navigation";
import { useContext } from "react";
import {
  SidebarContent,
  SidebarUserSection,
  SidebarWrapper,
} from "./sidebar-client";
import { SidebarItem } from "./sidebar-item";
import { SidebarToggle } from "./sidebar-toggle";

export function Sidebar({
  currentGuild,
  guilds,
  user,
  activeSection,
}: {
  currentGuild: GuildObject;
  guilds: GuildObject[];
  user: UserObject;
  activeSection?: string;
}) {
  const segment = useSelectedLayoutSegment();
  const { isOpen } = useContext(SidebarContext);
  const active = activeSection ?? segment ?? "dashboard";

  return (
    <SidebarWrapper>
      <div className="p-4 pb-2 justify-between items-center align-center sm:flex hidden">
        <div className="items-center h-10 justify-start flex flex-row">
          <div
            className={`overflow-hidden transition-all flex-shrink-0 ${
              isOpen ? "w-10 h-10 opacity-100" : "w-0 h-0 opacity-0"
            }`}
          >
            <Logo size={40} />
          </div>
          <SidebarContent>
            <Link href="/dashboard">
              <div className="flex flex-col leading-3 text-center">
                <h1>Welcomer</h1>
                <span className="text-small text-gray-500">Dashboard</span>
              </div>
            </Link>
          </SidebarContent>
        </div>
        <SidebarToggle />
      </div>
      <Divider className="mb-2 sm:block hidden" />
      <GuildSelectDropdown
        currentGuild={currentGuild}
        guilds={guilds}
        isOpen={isOpen}
      />
      <Divider className="mb-2 sm:block hidden" />

      <ul className="sm:flex-1 sm:block flex flex-row justify-evenly w-full px-3">
        <SidebarItem
          active={active === "home"}
          icon={<FaHome />}
          link={"/dashboard"}
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

      <Divider className="sm:block hidden" />

      <div className="p-3 justify-center sm:flex hidden">
        <SidebarUserSection isOpen={isOpen}>
          <UIUser
            avatarProps={{
              src: user.avatarUrl,
            }}
            description={user.id}
            name={user.username}
          />
        </SidebarUserSection>
        <LogoutIcon />
      </div>
    </SidebarWrapper>
  );
}
