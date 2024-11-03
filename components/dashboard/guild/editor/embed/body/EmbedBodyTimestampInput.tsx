"use client";

import { useWelcomerStore } from "@/state/welcomer";
import { parseDate } from "@internationalized/date";
import { DateInput } from "@nextui-org/date-input";
import { Divider } from "@nextui-org/divider";
import { DateValue, Switch } from "@nextui-org/react";
import { useState } from "react";
import { MdClear } from "react-icons/md";

export function EmbedBodyTimestampInput({
  embedIndex,
}: {
  embedIndex: number
  }) {
  
  const timestamp = useWelcomerStore((state) => state.embeds[embedIndex].timestamp);
  const setTimestamp = useWelcomerStore((state) => state.setEmbedTimestamp);
  
  function clearData() {
    setValue(null);
  }

  const clearDataButton = (
    <button onClick={clearData}>
      <MdClear />
    </button>
  );

  const [timestampEnabled, setTimestampEnabled] = useState<boolean>(false);

  return (
    <>
      <Divider />
      Timestamp
      <div className="space-y-3">
        <Switch
          isSelected={timestampEnabled}
          onChange={() => {
            setTimestampEnabled(!timestampEnabled);
          }}
        >
          Enable timestamp
        </Switch>
        {timestampEnabled ? (
          <>
            <Switch
              isSelected={timestamp === "current"}
              onChange={() => {
                setValue(value === "current" ? null : "current");
              }}
            >
              <p>
                Use current time{" "}
                <span className="text-small text-default-300">
                  (leave blank if you don&apos;t want to use a timestamp)
                </span>
              </p>
            </Switch>
            {value === "current" ? (
              <p>Current time will be used</p>
            ) : (
              <DateInput
                className="flex justify-center align-middle"
                endContent={clearDataButton}
                granularity="second"
                value={value as DateValue} // Cast value to DateValue
                onChange={setValue}
              />
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
