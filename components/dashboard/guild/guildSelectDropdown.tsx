"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { UserGuild } from "@prisma/client";
import NextLink from "next/link";

import { GuildExtended } from "@/types";
import GuildCard from "./guildCard";

export function GuildSelectDropdown({
  guilds,
  currentGuild,
  isOpen,
}: {
  guilds: GuildExtended[];
  currentGuild: UserGuild;
  isOpen: boolean;
}) {
  return (
    <Dropdown
      showArrow
      classNames={{
        base: "before:bg-default-200",
        content:
          "py-1 px-1  border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
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
        className="max-h-52 overflow-y-auto"
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
                {/* invite link for the bot */}
                <a
                  href={`/api/bot/add/${guild.id}`}
                >
                  <GuildCard guild={guild} />
                </a>
              </DropdownItem>
            );
          }
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
