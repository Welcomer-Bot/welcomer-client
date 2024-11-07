"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { Divider } from "@nextui-org/divider";
import { DatePicker, Switch } from "@nextui-org/react";
import { useState } from "react";
import { MdClear } from "react-icons/md";

export function EmbedBodyTimestampInput({
  embedIndex,
}: {
  embedIndex: number;
}) {
  const timestamp = useWelcomerStore(
    (state) => state.embeds[embedIndex].timestamp
  );
  const timestampNow = useWelcomerStore(
    (state) => state.embeds[embedIndex].timestampNow ?? false
  );
  const setTimestamp = useWelcomerStore((state) => state.setEmbedTimestamp);
  const setTimestampNow = useWelcomerStore(
    (state) => state.setEmbedTimestampNow
  );

  function clearData() {
    setTimestamp(embedIndex, null);
  }

  const [timestampEnabled, setTimestampEnabled] = useState(false);
  return (
    <>
      <Divider />
      Timestamp
      <div className="space-y-3">
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
          <>
            <Switch
              isSelected={timestampNow}
              onChange={() => {
                setTimestampNow(embedIndex, !timestampNow);
              }}
            >
              <p>
                Use current time{" "}
                <span className="text-small text-default-300">
                  (leave blank if you don&apos;t want to use a timestamp)
                </span>
              </p>
            </Switch>
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
                onChange={(value) => setTimestamp(embedIndex, value.toDate())}
              />
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
