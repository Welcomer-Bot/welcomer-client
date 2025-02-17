"use client";

import { ModuleName } from "@/types";
import { Button } from "@heroui/button";
import { redirect } from "next/navigation";


export default function ManageButton({guildId, module }: {guildId: string,  module: ModuleName }) {
    return (
        <Button
        color="primary"
        onPress={() => redirect(`/dashboard/${guildId}/${module.slice(0, -1)}`)}
        >
        Manage
        </Button>
    );
}