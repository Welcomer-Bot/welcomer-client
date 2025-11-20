"use client";

import { Period, SourceType } from "@/prisma/generated/client";
import { Select, SelectItem } from "@heroui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function PeriodSelector({
  guildId,
  module,
  currentPeriod,
}: {
  guildId: string;
  module: SourceType;
  currentPeriod: Period;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const periods = [
    {
      label: "Daily",
      value: Period.DAILY,
    },
    {
      label: "Weekly",
      value: Period.WEEKLY,
    },
    {
      label: "Monthly",
      value: Period.MONTHLY,
    },
    {
      label: "Total",
      value: Period.TOTAL,
    },
  ];

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value as Period;
    const params = new URLSearchParams(searchParams.toString());

    const paramKey = `${module.toLowerCase()}Period`;
    params.set(paramKey, newPeriod);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Select
      className="max-w-xs"
      label="Select Period"
      selectedKeys={[currentPeriod]}
      variant="bordered"
      onChange={handleSelectionChange}
      size="sm"
      isDisabled={isPending}
    >
      {periods.map((period) => (
        <SelectItem key={period.value}>{period.label}</SelectItem>
      ))}
    </Select>
  );
}
