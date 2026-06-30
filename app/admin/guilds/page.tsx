/**
 * Admin Guilds Management
 *
 * Affiche toutes les guilds du bot avec leurs sources (Welcomer, Leaver) activées.
 * Permet de gérer les guilds et les paramètres beta.
 *
 * @see components/admin/complete-guild-card.tsx
 * @see lib/dal.ts - getBotGuilds(), getSources(), getBetaTester()
 */

import { CompleteGuildCard } from "@/components/admin";
import { SourceType } from "@/generated/prisma/enums";
import { getBotGuilds } from "@/lib/dal/discord";
import { getBetaTester } from "@/lib/dal/session";
import { getSources } from "@/lib/dal/sources";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default async function Page() {
  const guilds = await getBotGuilds();
  if (!guilds) {
    return <p>No guilds found</p>;
  }
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold py-5">Bot Guilds</h1>
        </CardHeader>
        <CardBody>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {guilds.map(async (guild) => {
              const welcomer = (await getSources(guild.id, SourceType.WELCOMER))?.[0];
              const leaver = (await getSources(guild.id, SourceType.LEAVER))?.[0];
              const betaTester = await getBetaTester(guild.id);
              return (
                <CompleteGuildCard
                  key={guild.id}
                  guild={guild.toObject()}
                  welcomer={welcomer}
                  leaver={leaver}
                  betaTester={betaTester}
                />
              );
            })}
          </ul>
          <p>Total Guilds: {guilds.length}</p>
        </CardBody>
      </Card>
    </div>
  );
}
