
type shardStatus = {
  shardId: number;
  guilds: number;
  members: number;
  ping: number;
  status: number;
  lastUpdated: number;
};

export type clusterStatus = {
  clusterId: number;
  shardIds: number[];
  totalGuilds: number;
  totalUsers: number;
  ping: number;
  uptime: number;
  memoryUsage: number;
  perShardCluster: shardStatus[];
  lastUpdated: number;
};

class StatusManager {
  private clusterCount: number;
  private shardCount: number;
  private currentStatus: clusterStatus[];
  private intervalId: NodeJS.Timeout;
  public initialised: boolean;

  constructor(clusterCount: number, shardCount: number) {
    this.clusterCount = clusterCount;
    this.shardCount = shardCount;
    this.currentStatus = [];
    this.initialised = false;
    this.intervalId = setInterval(() => {
      this.checkForStaleData();
    }, 10000);
  }

  public updateStatus(status: clusterStatus) {
    const clusterIndex = this.currentStatus.findIndex(
      (cluster) => cluster.clusterId === status.clusterId
    );
    if (clusterIndex !== -1) {
      const cluster = this.currentStatus[clusterIndex];
      cluster.shardIds = status.shardIds;
      cluster.totalGuilds = status.totalGuilds;
      cluster.totalUsers = status.totalUsers;
      cluster.ping = status.ping;
      cluster.uptime = status.uptime;
      cluster.memoryUsage = status.memoryUsage;
      cluster.lastUpdated = Date.now();
      cluster.perShardCluster = cluster.perShardCluster.map((shard) => {
        const shardIndex = status.perShardCluster.findIndex(
          (s) => s.shardId === shard.shardId
        );
        if (shardIndex !== -1) {
          const updatedShard = status.perShardCluster[shardIndex];
          return {
            ...shard,
            guilds: updatedShard.guilds,
            members: updatedShard.members,
            ping: updatedShard.ping,
            status: updatedShard.status,
            lastUpdated: Date.now(),
          };
        }
        return shard;
      });
    } else {
      this.currentStatus.push({
        ...status,
        lastUpdated: Date.now(),
        perShardCluster: status.perShardCluster.map((shard) => ({
          ...shard,
          lastUpdated: Date.now(),
        })),
      });
      this.clusterCount++;
      this.shardCount += status.shardIds.length;
    }
    // console.log("Updated status for cluster", this.currentStatus);
  }

  private checkForStaleData() {
    // console.log("Checking for stale shards");
    const now = Date.now();

    this.currentStatus.forEach((cluster) => {
      cluster.perShardCluster = cluster.perShardCluster.map((shard) => {
        if (now - shard.lastUpdated >= 30000) {
          // console.log(
          //   `Shard ${shard.shardId} in cluster ${cluster.clusterId} is stale`
          // );
          return { ...shard, status: 5 };
        }
        return shard;
      });
    });
  }

  public getStatus() {
    // console.log("Getting status");
    // console.log(this.currentStatus);

  return this.currentStatus.map((cluster) => {
    const clusterUptime = (Date.now() - cluster.uptime) / 1000 /60;
    return {
      ...cluster,
      uptime: clusterUptime,
    };
  });

  }

  public stop() {
    clearInterval(this.intervalId);
  }
}

type GlobalThisType = typeof globalThis;

interface GlobalWithStatusManager extends GlobalThisType {
  statusManagerGlobal?: StatusManager;
}

const globalForStatus = global as GlobalWithStatusManager;

if (!globalForStatus.statusManagerGlobal) {
  globalForStatus.statusManagerGlobal = new StatusManager(0, 0);
}

export const statusManager = globalForStatus.statusManagerGlobal;
