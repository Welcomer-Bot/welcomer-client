"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { useContext } from "react";
import { useStore } from "zustand";
import {
  VariableHintsRow,
  type VariableHint,
} from "@/components/dashboard/guild/variable-hints-row";

const VARIABLE_HINTS: VariableHint[] = [
  { variable: "{user}", description: "User mention" },
  { variable: "{username}", description: "Username" },
  { variable: "{displayName}", description: "Display name" },
  { variable: "{guild}", description: "Server name" },
  { variable: "{memberCount}", description: "Member count" },
  { variable: "{memberCountFormatted}", description: "Formatted member count" },
  { variable: "{guildId}", description: "Guild ID" },
  { variable: "{userId}", description: "User ID" },
  { variable: "{discriminator}", description: "User discriminator" },
];

export default function ContentEditor() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const value = useStore(store, (state) => state.message?.content);
  const setValue = useStore(store, (state) => state.setContent);

  const charCount = value?.length ?? 0;
  const isNearLimit = charCount > 1800;
  const isOverLimit = charCount > 2000;

  return (
    <Card shadow="sm">
      <CardHeader className="pb-0 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-foreground">
          Message Content
        </h3>
        <span
          className={`text-sm font-mono ${
            isOverLimit
              ? "text-danger"
              : isNearLimit
                ? "text-warning"
                : "text-default-400"
          }`}
        >
          {charCount}/2000
        </span>
      </CardHeader>
      <CardBody className="space-y-3 pt-4">
        <Textarea
          placeholder="Welcome {user} to {guild}!"
          variant="bordered"
          validate={(value) => {
            if (value.length > 2000)
              return "Content must not exceed 2000 characters!";
          }}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          minRows={3}
          maxRows={8}
        />

        <VariableHintsRow
          hints={VARIABLE_HINTS}
          label="Variables:"
          onAppend={(variable) => setValue((value ?? "") + variable)}
        />
      </CardBody>
    </Card>
  );
}
