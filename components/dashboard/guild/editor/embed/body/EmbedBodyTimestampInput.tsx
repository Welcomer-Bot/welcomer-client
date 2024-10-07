"use client";

import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DateValue } from "@nextui-org/react";
import { useState } from "react";
import { MdClear } from "react-icons/md";

export function EmbedBodyTimestampInput({
  timestamp,
}: {
  timestamp: DateValue | null | undefined;
}) {
  function clearData() {
    setValue(null);
  }

  const clearDataButton = (
      <Button className="align-center" isIconOnly onClick={clearData}>
          <MdClear />
    </Button>
  );

  const [value, setValue] = useState(timestamp);

  return (
      <DateInput
    className="flex justify-center align-middle"
      endContent={clearDataButton}
      granularity="second"
      label={"Timestamp"}
      value={value}
      onChange={setValue}
    />
  );
}
