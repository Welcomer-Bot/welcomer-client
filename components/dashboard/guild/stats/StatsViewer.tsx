"use client";

import { usePeriodStatsQuery } from "@/lib/queries";
import { ModuleName } from "@/types";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { GuildStats, Period } from "@prisma/client";
import { useEffect, useState } from "react";
import PeriodSelector from "./PeriodSelector";
import { Skeleton } from "@heroui/skeleton";

export default function StatsViewer({
  guildId,
  module,
}: {
  guildId: string;
  module: ModuleName;
}) {
  const [period, setPeriod] = useState<Period>(Period.DAILY);
  const { data, isLoading } = usePeriodStatsQuery(guildId, period, module);

  return (
    <Card className="grid gap-5 px-5 pb-5">
      <CardHeader className="flex justify-between">
        <h2>{module[0].toUpperCase() + module.slice(1)} stats</h2>
        <PeriodSelector value={period} setValue={setPeriod} />
      </CardHeader>
      {isLoading ? (
        <div className="grid  md:grid-cols-4 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">Members welcomed</Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">Members welcomed</Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">Members welcomed</Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">Members welcomed</Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="grid  md:grid-cols-4 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Members welcomed
            </CardHeader>
            <CardBody>{data?.membersEvent}</CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Generated Messages
            </CardHeader>
            <CardBody>{data?.generatedMessages}</CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Generated Images
            </CardHeader>
            <CardBody>{data?.generatedImages}</CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Generated Embeds
            </CardHeader>
            <CardBody>{data?.generatedEmbeds}</CardBody>
          </Card>
        </div>
      )}
    </Card>
  );
}
