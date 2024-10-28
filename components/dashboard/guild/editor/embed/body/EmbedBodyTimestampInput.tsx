"use client";

import { parseDate } from "@internationalized/date";
import { DateInput } from "@nextui-org/date-input";
import { Divider } from "@nextui-org/divider";
import { DateValue, Switch } from "@nextui-org/react";
import { useState } from "react";
import { MdClear } from "react-icons/md";

export function EmbedBodyTimestampInput({
  timestamp,
}: {
  timestamp: string | null | undefined;
}) {
  function clearData() {
    setValue(null);
  }

  const clearDataButton = (
    <button onClick={clearData}>
      <MdClear />
    </button>
  );

  const [timestampEnabled, setTimestampEnabled] = useState<boolean>(false);
  const [value, setValue] = useState<DateValue | string | null>(
    // parse the timestamp string to a DateValue
    timestamp ? parseDate(timestamp) : null,
  );

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
              isSelected={value === "current"}
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
