"use client";

import { Select, SelectItem } from "@heroui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { StatsRange } from "@/lib/dto";

const RANGES: { label: string; value: StatsRange }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "All time", value: "all" },
];

export default function RangeSelector({
  currentRange,
}: {
  currentRange: StatsRange;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("statsRange", e.target.value);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Select
      className="max-w-xs"
      label="Range"
      selectedKeys={[currentRange]}
      variant="bordered"
      onChange={handleSelectionChange}
      size="sm"
      isDisabled={isPending}
    >
      {RANGES.map((range) => (
        <SelectItem key={range.value}>{range.label}</SelectItem>
      ))}
    </Select>
  );
}
