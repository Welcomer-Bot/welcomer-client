"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { variableHints } from "@welcomer-bot/utils";
import { useContext } from "react";
import { useStore } from "zustand";
import { VariableHintsRow } from "@/components/dashboard/guild/variable-hints-row";
import { MESSAGE_LIMITS } from "@/lib/discord/limits";

export default function ContentEditor() {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
  const value = useStore(store, (state) => state.message?.content);
  const setValue = useStore(store, (state) => state.setContent);

  const charCount = value?.length ?? 0;
  // 90 % of the limit: the counter turns amber before it turns red.
  const isNearLimit = charCount > MESSAGE_LIMITS.content * 0.9;
  const isOverLimit = charCount > MESSAGE_LIMITS.content;

  return (
    <Card shadow="sm">
      <CardHeader className="pb-0 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-foreground">
          Message Content
        </h2>
        <span
          className={`text-sm font-mono ${
            isOverLimit
              ? "text-danger"
              : isNearLimit
                ? "text-warning"
                : "text-default-400"
          }`}
        >
          {charCount}/{MESSAGE_LIMITS.content}
        </span>
      </CardHeader>
      <CardBody className="space-y-3 pt-4">
        <Textarea
          placeholder="Welcome {user} to {guild}!"
          variant="bordered"
          validate={(value) => {
            if (value.length > MESSAGE_LIMITS.content)
              return `Content must not exceed ${MESSAGE_LIMITS.content} characters!`;
          }}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          minRows={3}
          maxRows={8}
        />

        <VariableHintsRow
          hints={variableHints}
          label="Variables:"
          onAppend={(variable) => setValue((value ?? "") + variable)}
        />
      </CardBody>
    </Card>
  );
}
