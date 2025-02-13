"use client";

import { Select, SelectItem } from "@heroui/select";
import { Period } from "@prisma/client";

export default function PeriodSelector({
    value,
    setValue,
}: {
    value: Period;
    setValue: any;
}) {
    const periods = [
        {
            label: "Daily",
            value: Period.DAILY
        },
        {
            label: "Weekly",
            value: Period.WEEKLY
        },
        {
            label: "Monthly",
            value: Period.MONTHLY
        },
        {
            label: "Total",
            value: Period.TOTAL
        }
    ]

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value as Period);
    };
    return (
      <Select
        className="max-w-xs"

        label="Select Period"
        selectedKeys={[value]}
        variant="bordered"
        onChange={handleSelectionChange}
        size="sm"
      >
        {periods.map((period) => (
          <SelectItem key={period.value}>{period.label}</SelectItem>
        ))}
      </Select>
    );
}