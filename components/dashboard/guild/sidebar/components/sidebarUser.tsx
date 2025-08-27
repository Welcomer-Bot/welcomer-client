"use client";

import { User as UIUser } from "@heroui/react";
import { useContext } from "react";

import { SidebarContext } from "@/app/providers";
import { UserObject } from "@/lib/discord/user";
import { LogoutIcon } from "../../logoutIcon";

interface SidebarUserProps {
  user: UserObject;
}

export function SidebarUser({ user }: SidebarUserProps) {
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className="p-3 justify-center sm:flex hidden">
      <div
        className={`
          flex justify-between items-center
          overflow-hidden transition-all ${isOpen ? "w-48 ml-3" : "w-0"}
        `}
      >
        <UIUser
          avatarProps={{
            src: user.avatarUrl,
          }}
          description={user.id}
          name={user.username}
        />
      </div>
      <LogoutIcon />
    </div>
  );
}
