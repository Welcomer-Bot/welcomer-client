"use client";

import { GuildInput } from "@/components/shared/status/guild-input";
import { fetchClustersShardsSatus } from "@/lib/discord/shard";
import { type clusterStatus } from "@/lib/discord/status";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button, Divider, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<clusterStatus[]>([]);
  const [selectedShard, setSelectedShard] = useState<number | null>(null);
  const [updateTime, setUpdateTime] = useState<number>(0);
  useEffect(() => {
    async function updateStatus() {
      const statusUpdate = await fetchClustersShardsSatus();
      setStatus(statusUpdate);
      setUpdateTime(20); // Reset timer when status updates
    }
    updateStatus();
    const interval = setInterval(() => {
      updateStatus();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTime((prev) => prev - 1);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const allGood = status.every((cluster) =>
    cluster.perShardCluster.every((shard) => shard.status === 0)
  );

  return (
    <div className="mx-5">
      <Card className="m-10 max-w-7xl h-fit mx-auto w-full">
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
                          Uptime:{" "}
                          {cluster.uptime > 60
                            ? `${Math.floor(cluster.uptime / 60)}h ${Math.floor(
                                cluster.uptime % 60
                              )}m`
                            : `${Math.floor(cluster.uptime)}m`}
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
                          variant={
                            selectedShard === shard.shardId ? "shadow" : "ghost"
                          }
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
        <CardFooter>
          <p className="text-sm text-gray-400">
            Updating in {updateTime} seconds
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
