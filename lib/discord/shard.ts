"use server";

import {statusManager} from "./status";

export async function fetchGuildShardId(guildId: string) {
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

export async function fetchClustersShardsSatus() {
  return statusManager.getStatus();
}