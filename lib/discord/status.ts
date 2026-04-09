type ShardStatus = {
  shardId: number;
  guilds: number;
  members: number;
  ping: number;
  status: number;
  lastUpdated: number;
};

export type ClusterStatus = {
  clusterId: number;
  shardIds: number[];
  totalGuilds: number;
  totalUsers: number;
  ping: number;
  uptime: number;
  memoryUsage: number;
  perShardCluster: ShardStatus[];
  lastUpdated: number;
};

class StatusManager {
  public initialised: boolean;
  private clusterCount: number;
  private shardCount: number;
  private currentStatus: ClusterStatus[];

  constructor(clusterCount: number, shardCount: number) {
    this.clusterCount = clusterCount;
    this.shardCount = shardCount;
    this.currentStatus = [];
    this.initialised = false;
    setInterval(() => {
      this.checkForStaleData();
    }, 10000);
  }

  public updateStatus(status: ClusterStatus) {
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
  }

  public getStatus() {
    return this.currentStatus.map((cluster) => {
      const clusterUptime = (Date.now() - cluster.uptime) / 1000 / 60;
      return {
        ...cluster,
        uptime: clusterUptime,
      };
    });
  }

  private checkForStaleData() {
    const now = Date.now();

    this.currentStatus.forEach((cluster) => {
      cluster.perShardCluster = cluster.perShardCluster.map((shard) => {
        if (now - shard.lastUpdated >= 30000) {
          return { ...shard, status: 5 };
        }
        return shard;
      });
    });
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
