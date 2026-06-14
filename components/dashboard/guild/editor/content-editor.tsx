"use client";

import { SourceStoreContext } from "@/features/dashboard/modules/providers";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { variableHints } from "@welcomer-bot/utils";
import { useContext } from "react";
import { useStore } from "zustand";
import { VariableHintsRow } from "@/components/dashboard/guild/variable-hints-row";

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
          hints={variableHints}
          label="Variables:"
          onAppend={(variable) => setValue((value ?? "") + variable)}
        />
      </CardBody>
    </Card>
  );
}
