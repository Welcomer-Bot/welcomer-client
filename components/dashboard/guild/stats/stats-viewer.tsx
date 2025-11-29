import { fetchGuildStat } from "@/lib/dto";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Period, SourceType } from "../../../../generated/prisma/browser";
import PeriodSelector from "./period-selector";

export default async function StatsViewer({
  guildId,
  module,
  period = Period.DAILY,
}: {
  guildId: string;
  module: SourceType;
  period?: Period;
}) {
  const data = await fetchGuildStat(guildId, period, module);

  const formattedModule = `${module[0].toUpperCase() + module.slice(1)} stats`;
  const countableModule = module.slice(0, module.length - 1) + "d";

  return (
    <Card className="grid gap-5 px-5 pb-5">
      <CardHeader className="flex justify-between">
        <h2>{formattedModule}</h2>
        <PeriodSelector
          guildId={guildId}
          module={module}
          currentPeriod={period}
        />
      </CardHeader>
      {data ? (
        <div className="grid  md:grid-cols-4 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Members {countableModule}
            </CardHeader>
            <CardBody>{data.membersEvent}</CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Generated Messages
            </CardHeader>
            <CardBody>{data.generatedMessages}</CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Generated Images
            </CardHeader>
            <CardBody>{data.generatedImages}</CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Generated Embeds
            </CardHeader>
            <CardBody>{data.generatedEmbeds}</CardBody>
          </Card>
        </div>
      ) : (
        <p className="flex justify-center align-middle">
          No data for this module{" "}
        </p>
      )}
    </Card>
  );
}
