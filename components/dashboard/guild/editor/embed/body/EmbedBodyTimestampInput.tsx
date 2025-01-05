"use client";

import { useLeaverStore } from "@/state/leaver";
import { useModuleStore } from "@/state/module";
import { useWelcomerStore } from "@/state/welcomer";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { Divider } from "@nextui-org/divider";
import { DatePicker, Switch } from "@nextui-org/react";
import { useState } from "react";

export function EmbedBodyTimestampInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const module = useModuleStore((state) => state.moduleName);
  const store = module === "welcomer" ? useWelcomerStore() : useLeaverStore();

  const timestamp = store.embeds[embedIndex].timestamp;

  const timestampNow = store.embeds[embedIndex].timestampNow ?? false;

  const setTimestamp = useWelcomerStore((state) => state.setEmbedTimestamp);
  const setTimestampNow = store.setEmbedTimestampNow;

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
              isSelected={timestampNow}
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
                onChange={(value) =>
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
