import { SignIn } from "@/components/auth";
import { Avatar } from "@heroui/avatar";
import NavbarUserDropdown from "./navbar-user-dropdown";

import { LogoutButton } from "@/components/dashboard/guild";
import { fetchUserFromSession } from "@/lib/dal/session";
import React from "react";

export default async function NavbarUser(): Promise<React.ReactElement> {
  const user = await fetchUserFromSession();

  if (!user)
    return (
      <div>
        <SignIn />
      </div>
    );

  return (
    <>
      <span className="sm:block hidden">
        <NavbarUserDropdown user={user.toObject()} />
      </span>
      <span className="sm:hidden h-full flex flex-col justify-between">
        <div className="w-fit">
          <LogoutButton />
        </div>
        <div className="flex">
          <Avatar
            isBordered
            showFallback
            className="mr-3"
            name={user.username || "Discord User"}
            size="sm"
            src={user.avatarUrl}
          />
          Connected as {user.username}
        </div>
      </span>
    </>
  );
}
