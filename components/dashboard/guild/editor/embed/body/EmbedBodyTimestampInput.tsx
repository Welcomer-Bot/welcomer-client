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
  const timestampNow = useStore(
    store,
    (state) => state.embeds[embedIndex].timestampNow
  );
  const timestamp = useStore(
    store,
    (state) => state.embeds[embedIndex].timestamp
  );
  const setTimestampNow = useStore(
    store,
    (state) => state.setEmbedTimestampNow
  );
  const setTimestamp = useStore(store, (state) => state.setEmbedTimestamp);

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
                setTimestampNow(embedIndex, false);
                setTimestamp(embedIndex, null);
              }
            }}
          >
            Enable timestamp
          </Switch>
          {timestampEnabled ? (
            <Switch
              isSelected={timestampNow ?? false}
              onChange={() => {
                setTimestampNow(embedIndex, !timestampNow);
              }}
            >
              <p>Use current time </p>
            </Switch>
          ) : null}
        </div>
        {timestampEnabled ? (
          <>
            {timestampNow ? (
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
                  setTimestamp(embedIndex, value?.toDate() ?? null)
                }
              />
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
