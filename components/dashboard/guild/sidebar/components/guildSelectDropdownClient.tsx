"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import NextLink from "next/link";
import { useContext } from "react";

import { SidebarContext } from "@/app/providers";
import { GuildObject } from "@/lib/discord/guild";
import { inviteBotToGuild } from "@/lib/discord/invite";
import GuildCard from "../../guildCard";

interface GuildSelectDropdownClientProps {
  guilds: GuildObject[];
  currentGuild: GuildObject;
}

export function GuildSelectDropdownClient({
  guilds,
  currentGuild,
}: GuildSelectDropdownClientProps) {
  const { isOpen } = useContext(SidebarContext);

  return (
    <Dropdown
      showArrow
      classNames={{
        base: "before:bg-default-200",
        content:
          "py-1 px-1 w-full border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}
      placement="bottom-start"
    >
      <DropdownTrigger>
        <button className="m-2">
          <GuildCard guild={currentGuild} isOpen={isOpen} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="other guilds"
        className="max-h-52 overflow-y-auto no-scrollbar"
        variant="flat"
      >
        {guilds.map((guild) => {
          if (guild.mutual) {
            return (
              <DropdownItem key={guild.id} textValue={guild.id}>
                <NextLink href={`/dashboard/${guild.id}`}>
                  <GuildCard guild={guild} />
                </NextLink>
              </DropdownItem>
            );
          } else {
            return (
              <DropdownItem key={guild.id} textValue={guild.id}>
                <div
                  onClick={async () => {
                    await inviteBotToGuild(guild.id);
                  }}
                >
                  <GuildCard guild={guild} />
                </div>
              </DropdownItem>
            );
          }
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
