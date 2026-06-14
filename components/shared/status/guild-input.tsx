"use client";

import {fetchGuildShardId} from "@/lib/discord/shard";
import {Input} from "@heroui/input";
import {useEffect, useState} from "react";

export const GuildInput = ({
                               onShardSelected,
                           }: {
    onShardSelected: (shardId: number | null) => void;
}) => {
    const [guildId, setGuildId] = useState("");
    const [shardId, setShardId] = useState<number | null>(null);
    useEffect(() => {
        const fetchGuildShard = async (guildId: string) => {
            const shard = await fetchGuildShardId(guildId);
            if (shard?.id === undefined) {
                onShardSelected(null);
                setShardId(null);
            } else {
                onShardSelected(shard.id);
                setShardId(shard.id);
            }
        };
        if (guildId) {
            fetchGuildShard(guildId)
        }
    }, [guildId, onShardSelected]);
    return (
        <div>
            <div>
                <Input
                    value={guildId}
                    onChange={(e) => setGuildId(e.target.value)}
                    type="text"
                    onClear={() => setGuildId("")}
                    isClearable
                    placeholder="Enter your guild ID"
                    className="w-full"
                />
            </div>
            {shardId !== undefined && (
                <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected Shard ID: {shardId}</p>
                </div>
            )}
        </div>
    );
};
