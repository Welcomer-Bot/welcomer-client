import { fetchGuildStats, StatsRange } from "@/lib/dto";

import { Card, CardBody, CardHeader } from "@heroui/card";
import RangeSelector from "./range-selector";

const METRICS = [
  { key: "joins", label: "Members joined" },
  { key: "leaves", label: "Members left" },
  { key: "messages", label: "Generated messages" },
  { key: "embeds", label: "Generated embeds" },
  { key: "images", label: "Generated images" },
] as const;

export default async function StatsViewer({
  guildId,
  range = "7d",
}: {
  guildId: string;
  range?: StatsRange;
}) {
  const data = await fetchGuildStats(guildId, range);

  return (
    <Card className="grid gap-5 px-5 pb-5">
      <CardHeader className="flex justify-between">
        <h2>Server stats</h2>
        <RangeSelector currentRange={range} />
      </CardHeader>
      <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-4">
        {METRICS.map((metric) => (
          <Card key={metric.key}>
            <CardHeader className="text-gray-400 text-sm">
              {metric.label}
            </CardHeader>
            <CardBody>{data[metric.key]}</CardBody>
          </Card>
        ))}
      </div>
    </Card>
  );
}
