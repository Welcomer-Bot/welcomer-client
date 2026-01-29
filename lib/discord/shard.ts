"use server";

import { unstable_cache } from "next/cache";
import {statusManager} from "./status";

export async function fetchGuildShardId(guildId: string) {
    // Validate: Discord guild IDs are digits only
    if (!/^[0-9]+$/.test(guildId)) {
      return null;
    }
    return fetch(process.env.INTERNAL_API_BASE_URL + "/status/" + guildId, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch(() => {
        return null;
      });
}


export const fetchClustersShardsSatus = unstable_cache(
  async () => {
    return statusManager.getStatus();
  },
  ["status"],
  {
    revalidate: 60,
    tags: ["status"],
  }
);