"use client";

import { useUserQuery } from "@/lib/queries";
import { Autocomplete, AutocompleteItem, Card } from "@heroui/react";
import { User } from "@prisma/client";
import { useState } from "react";
import GuildCard from "./GuildCard";

export default function UserSearch({ users }: { users: User[] }) {
  const [value, setValue] = useState<React.Key | null>(null);
  const { data, isLoading } = useUserQuery(value?.toString() || "");
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
        ) : data ? (
          <div>
            {" "}
            <div className="space-y-4">
              {data.guilds.map((guild) => (
                <GuildCard guild={guild} key={guild.id} />
              ))}
            </div>
          </div>
        ) : (
          <p>User not found</p>
        )}
      </Card>
    </>
  );
}
