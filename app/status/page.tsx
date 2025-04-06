"use client";

import { GuildInput } from "@/components/status/GuildInput";
import { fetchClustersShardsSatus } from "@/lib/discord/shard";
import { type clusterStatus } from "@/lib/discord/status";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";
import { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<clusterStatus[]>([]);
  const [selectedShard, setSelectedShard] = useState<number | null>(null); 
  useEffect(() => {
    async function updateStatus() {
      const statusUpdate = await fetchClustersShardsSatus();
      console.log(statusUpdate);
      setStatus(statusUpdate); // Update state after mount
    }
    updateStatus(); // Initial fetch of status
    const interval = setInterval(() => {
      updateStatus(); // Fetch status every 10 seconds
    }, 10000); // Update every 10 seconds to match `checkForStaleData`

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const allGood = status.every((cluster) =>
    cluster.perShardCluster.every((shard) => shard.status === 0)
  );

  return (
    <>
      <Card className="m-10">
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl w-full">Welcomer Status</h1>
            <p
              className={`text-sm w-full ${
                allGood ? "text-green-500" : "text-red-500"
              }`}
            >
              {allGood
                ? "All clusters are online"
                : "Some clusters are offline. Please check the status."}
            </p>
          </div>
          <GuildInput setSelectedShard={setSelectedShard} />
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-5 sm:grid-cols-4 grid-cols-2 w-full gap-4 content-center">
            {status.map((cluster) => (
              <Card key={cluster.clusterId}>
                <CardHeader className="flex flex-col text-start">
                  <Tooltip
                    content={
                      <div>
                        <h3>Cluster {cluster.clusterId}</h3>
                        <Divider className="my-2" />
                        <p>Total Guilds: {cluster.totalGuilds}</p>
                        <p>Total Users: {cluster.totalUsers}</p>
                        <p>Ping: {cluster.ping}ms</p>
                        <p>
                          Uptime:
                          {cluster.uptime > 60
                            ? `${Math.floor(cluster.uptime / 60)}h ${
                                cluster.uptime % 60
                              }m`
                            : `${cluster.uptime}m`}
                        </p>
                        <p>Memory Usage: {cluster.memoryUsage}MB</p>
                        <Divider className="my-2" />
                        <p>
                          Last Updated:{" "}
                          {new Date(cluster.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    }
                  >
                    <div className="text-start w-full">
                      <h2>Cluster #{cluster.clusterId} </h2>
                      <p className="text-sm text-gray-400">
                        (
                        {
                          cluster.perShardCluster.filter((c) => c.status === 0)
                            .length
                        }
                        /{cluster.perShardCluster.length}) online
                      </p>
                    </div>
                  </Tooltip>
                </CardHeader>
                <CardBody className="flex flex-row flex-wrap gap-2">
                  {cluster.perShardCluster.map((shard) => {
                    const shardStatus =
                      shard.status === 0 ? "Online" : "Offline";
                    return (
                      <Tooltip
                        key={shard.shardId}
                        content={
                          <div>
                            <h3>Shard {shard.shardId}</h3>
                            <Divider className="my-2" />
                            <p>Status: {shardStatus}</p>
                            <p>Guilds: {shard.guilds}</p>
                            <p>Members: {shard.members}</p>
                            <p>Ping: {shard.ping}ms</p>
                            <Divider className="my-2" />
                            <p>
                              Last Updated:{" "}
                              {new Date(shard.lastUpdated).toLocaleString()}
                            </p>
                          </div>
                        }
                      >
                        <Button
                          color={shard.status === 0 ? "success" : "danger"}
                          isIconOnly
                          variant={selectedShard === shard.shardId ? "shadow" : "ghost"}
                          className={"text-center w-10 h-10"}
                        >
                          <CardBody className="text-center p-0">
                            <h4>{shard.shardId}</h4>
                          </CardBody>
                        </Button>
                      </Tooltip>
                    );
                  })}
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
