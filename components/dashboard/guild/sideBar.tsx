"use client";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { User } from "@nextui-org/user";
import { APIGuild, APIUser } from "discord-api-types/v10";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { FaDoorOpen, FaHome } from "react-icons/fa";
import { ImEnter } from "react-icons/im";

import { GuildSelectDropdown } from "./guildSelectDropdown";
import { LogoutIcon } from "./logoutIcon";

import { Logo } from "@/components/icons";
import { getUserAvatar } from "@/lib/utils";
import { APIGuildExtended } from "@/types";

const SidebarContext = createContext({ isOpen: true });

export function Sidebar({
  currentGuild,
  guilds,
  user,
}: {
  currentGuild: APIGuild;
  guilds: APIGuildExtended[];
  user: APIUser;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="h-screen fixed sm:relative">
      <nav className="h-full flex flex-col bg-slate-800 border-r border-slate-700 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center align-center">
          <div className={` items-center h-10 justify-start flex flex-row `}>
            <Logo
              className={`overflow-hidden transition-all ${
                isOpen ? "w-10" : "w-0"
              } `}
              size={40}
            />
            <div
              className={`overflow-hidden transition-all ${
                isOpen ? "w-20 opacity-100" : "w-0 opacity-0"
              } `}
            >
              <Link href="/dashboard">
                <div className={`flex flex-col leading-3 text-center `}>
                  <h1>Welcomer</h1>
                  <span className="text-small text-gray-500 ">Dashboard</span>
                </div>
              </Link>
            </div>
          </div>
          <Button
            isIconOnly
            className="p-1.5 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16m-7 6h7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </Button>
        </div>
        <Divider className="mb-2" />

        <GuildSelectDropdown currentGuild={currentGuild} guilds={guilds} isOpen={isOpen} />
        <Divider className="my-2" />

        <SidebarContext.Provider value={{ isOpen }}>
          <ul className="flex-1 px-3">
            <SidebarItem icon={<FaHome />} link={"/dashboard"} text="Home" />
            <SidebarItem
              active
              icon={<FaHome />}
              link={`/dashboard/${currentGuild.id}`}
              text="Dashboard"
            />
            <SidebarItem
              icon={<ImEnter />}
              link={`/dashboard/${currentGuild.id}/welcome`}
              text="Welcomer"
            />
            <SidebarItem
              icon={<FaDoorOpen />}
              link={`/dashboard/${currentGuild.id}/leave`}
              text="Dashboard"
            />
          </ul>
        </SidebarContext.Provider>
        <Divider />
        <div className="flex p-3 justify-center">
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${isOpen ? "w-48 ml-3" : "w-0"}
          `}
          >
            <User
              avatarProps={{
                src: getUserAvatar(user),
              }}
              name={user.username}
            />
          </div>
          <LogoutIcon />
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  link,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  link: string;
  active?: boolean;
}) {
  const { isOpen } = useContext(SidebarContext);

  return (
    <Link href={link}>
      <li
        className={`relative flex items-center justify-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group hover:text-indigo-800
        ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-white-600"}`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            isOpen ? "w-48 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {!isOpen && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
