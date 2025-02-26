"use client";

import { fetchUserDataAdmin } from "@/lib/dto";
import { GuildExtended } from "@/types";
import { Autocomplete, AutocompleteItem, Card } from "@heroui/react";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import GuildCard from "./GuildCard";
export default function UserSearch({ users }: { users: User[] }) {
  const [value, setValue] = useState<React.Key | null>(null);
  const [user, setUser] = useState<
    | (User & {
        guilds: GuildExtended[] | null;
      })
    | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateStats = async () => {
      setIsLoading(true);
      const updatedUser = await fetchUserDataAdmin(value as string);
      setUser(updatedUser);
      setIsLoading(false);
    };
    updateStats();
  }, [value]);

  return (
    <>
      <Autocomplete
        className="mb-4"
        label={"User ID"}
        selectedKey={value?.toString()}
        onSelectionChange={setValue}
      >
        {users.map((user) => (
          <AutocompleteItem
            key={user.id}
            textValue={`${user.username} (${user.id})`}
          >
            {user.username} ({user.id})
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Card>
        {!value ? (
          <p>Select a user</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : user ? (
          <div>
            {" "}
            <div className="space-y-4">
              {user.guilds ? (
                user.guilds.map((guild) => (
                  <GuildCard guild={guild} key={guild.id} />
                ))
              ) : (
                <p>No guilds found</p>
              )}
            </div>
          </div>
        ) : (
          <p>User not found</p>
        )}
      </Card>
    </>
  );
}
