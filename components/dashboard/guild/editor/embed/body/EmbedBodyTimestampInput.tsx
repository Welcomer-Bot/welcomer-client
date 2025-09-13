"use client";

import { SourceStoreContext } from "@/providers/sourceStoreProvider";
import { DatePicker } from "@heroui/date-picker";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { useContext, useState } from "react";
import { useStore } from "zustand";

export function EmbedBodyTimestampInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const store = useContext(SourceStoreContext);
  if (!store) throw new Error("Missing SourceStore.Provider in the tree");
    const embed = useStore(
      store,
      (state) =>
        state.modified.message?.embeds?.[embedIndex] ??
        state.message?.embeds?.[embedIndex]
    );
    const editEmbed = useStore(store, (state) => state.editEmbed);
  const timestamp = embed?.timestamp
    ? new Date(embed.timestamp).getTime()
    : null;

  const [timestampEnabled, setTimestampEnabled] = useState(false);
  return (
    <>
      <Divider />
      Timestamp
      <div className="space-y-3">
        <div className="flex space-x-5">
          <Switch
            isSelected={timestampEnabled}
            onValueChange={(value) => {
              if (value) {
                setTimestampEnabled(true);
              } else {
                setTimestampEnabled(false);
                editEmbed(embedIndex, {
                  ...embed,
                  timestamp: undefined,
                });
              }
            }}
          >
            Enable timestamp
          </Switch>
          {timestampEnabled ? (
            <Switch
              isSelected={timestampEnabled ?? false}
              onChange={() => {
                editEmbed(embedIndex, {
                  ...embed,
                  timestamp: "true",
                });
              }}
            >
              <p>Use current time </p>
            </Switch>
          ) : null}
        </div>
        {timestampEnabled ? (
          <>
            {embed?.timestamp == "true" ? (
              <p>Current time will be used</p>
            ) : (
              <DatePicker
                className="flex justify-center align-middle"
                granularity="second"
                label="Timestamp:"
                hideTimeZone
                value={
                  timestamp !== null && timestamp != undefined
                    ? parseAbsoluteToLocal(new Date(timestamp).toISOString())
                    : undefined
                }
                onChange={(value: ZonedDateTime | null) =>
                  editEmbed(embedIndex, {
                    ...embed,
                    timestamp: value
                      ? new Date(value.toString().substring(0, 19)).toISOString()
                      : undefined,
                  })
                }
              />
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
