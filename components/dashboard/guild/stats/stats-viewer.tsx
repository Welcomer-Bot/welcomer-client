import { fetchGuildStats } from "@/lib/dto";
import { StatsRange } from "@/lib/utils";

import { Card, CardBody, CardHeader } from "@heroui/card";
import MemberChart from "./member-chart";
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

  const { series } = data;

  // The series spans the whole window, so days without a snapshot are null —
  // compare the first and last days actually measured.
  const known = series.filter((p) => p.memberCount !== null);
  const delta =
    known.length >= 2
      ? known[known.length - 1].memberCount! - known[0].memberCount!
      : null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-large font-semibold">Server stats</h2>
        <RangeSelector currentRange={range} />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 pb-0">
          <span className="text-small text-default-500">Member count</span>
          {delta !== null && (
            <span
              className={`text-small tabular-nums ${
                delta > 0
                  ? "text-success"
                  : delta < 0
                    ? "text-danger"
                    : "text-default-400"
              }`}
            >
              {delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{" "}
              {delta === 0 ? "no change" : Math.abs(delta).toLocaleString()}
            </span>
          )}
        </CardHeader>
        <CardBody>
          <MemberChart series={series} />
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {METRICS.map((metric) => (
          <Card key={metric.key}>
            <CardHeader className="pb-0 text-small text-default-500">
              {metric.label}
            </CardHeader>
            <CardBody className="text-2xl font-semibold tabular-nums">
              {data[metric.key].toLocaleString()}
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
