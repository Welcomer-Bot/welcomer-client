"use client";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";

import { signOut } from "@/lib/actions";
import { UserObject } from "@/lib/discord/user";
import { User as UIUser } from "@heroui/react";

export default function NavbarUserDropdown({ user }: { user: UserObject }) {
  if (!user) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as="button"
          className="transition-transform"
          name={user.username || "Discord User"}
          size="sm"
          src={user.avatarUrl}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownSection showDivider aria-label="Profile & Actions">
          <DropdownItem key="profile" isReadOnly className="h-14 gap-2">
            <UIUser
              avatarProps={{
                src: user.avatarUrl,
                size: "sm",
                showFallback: true,
                isBordered: true,
                name: user.username || "Discord User",
              }}
              description={user.id}
              name={user.username}
            />
          </DropdownItem>
        </DropdownSection>

        <DropdownItem key="dashboard" href="/dashboard">
          My servers
        </DropdownItem>
        <DropdownItem key="help_and_feedback" href="/help">
          Help & Feedback
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
