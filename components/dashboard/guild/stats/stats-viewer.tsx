"use client";

import { fetchGuildStat } from "@/lib/dto";

import { GuildStats, Period, SourceType } from "@/prisma/generated/client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { useEffect, useState } from "react";
import PeriodSelector from "./period-selector";

export default function StatsViewer({
  guildId,
  module,
}: {
  guildId: string;
  module: SourceType;
}) {
  const [period, setPeriod] = useState<Period>(Period.DAILY);
  const [data, setData] = useState<GuildStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const updateStats = async () => {
      setIsLoading(true);
      const updatedData = await fetchGuildStat(guildId, period, module);
      // const chartData = await fetchAllGuildStatsSinceTime(guildId, period, module, new Date("12/05/24"))
      // console.log(chartData);
      setData(updatedData);
      setIsLoading(false);
    };
    updateStats();
  }, [period, guildId, module]);

  const formattedModule = `${module[0].toUpperCase() + module.slice(1)} stats`;
  const countableModule = module.slice(0, module.length - 1) + "d";

  return (
    <Card className="grid gap-5 px-5 pb-5">
      <CardHeader className="flex justify-between">
        <h2>{formattedModule}</h2>
        <PeriodSelector value={period} setValue={setPeriod} />
      </CardHeader>
      {isLoading ? (
        <div className="grid  md:grid-cols-4 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">
                Members {countableModule}
              </Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">
                Members {countableModule}
              </Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">
                Members {countableModule}
              </Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              <Skeleton className="rounded-lg">
                Members {countableModule}
              </Skeleton>
            </CardHeader>
            <CardBody>
              <Skeleton className="rounded-lg">999</Skeleton>
            </CardBody>
          </Card>
        </div>
      ) : data ? (
        <div className="grid  md:grid-cols-4 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="text-gray-400 text-sm">
              Members {countableModule}
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
      ) : (
        <p className="flex justify-center align-middle">
          No data for this module{" "}
        </p>
      )}
    </Card>
  );
}
