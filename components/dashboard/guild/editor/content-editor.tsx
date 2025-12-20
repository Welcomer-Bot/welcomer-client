"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { useContext } from "react";
import { useStore } from "zustand";

const VARIABLE_HINTS = [
  { variable: "{user}", description: "User mention" },
  { variable: "{user.username}", description: "Username" },
  { variable: "{user.displayName}", description: "Display name" },
  { variable: "{guild}", description: "Server name" },
  { variable: "{guild.memberCount}", description: "Member count" },
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

        {/* Variable hints */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-default-400 mr-2">Variables:</span>
          {VARIABLE_HINTS.map((hint) => (
            <Tooltip key={hint.variable} content={hint.description}>
              <button
                type="button"
                onClick={() => {
                  setValue((value ?? "") + hint.variable);
                }}
                className="text-xs px-2 py-1 rounded-full bg-default-100 hover:bg-primary/20 hover:text-primary transition-colors font-mono"
              >
                {hint.variable}
              </button>
            </Tooltip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
