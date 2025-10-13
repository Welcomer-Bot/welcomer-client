import CompleteGuildCard from "@/components/admin/complete-guild-card";
import { getBetaTester, getBotGuilds, getSources } from "@/lib/dal";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default async function Page() {
  const guilds = await getBotGuilds();
  // console.log(guilds);
  if (!guilds) {
    return <p>No guilds found</p>;
  }
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold py-5">Admin Guilds Page</h1>
        </CardHeader>
        <CardBody>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {guilds.map(async (guild) => {
              const welcomer = (await getSources(guild.id, "Welcomer"))?.[0];
              const leaver = (await getSources(guild.id, "Leaver"))?.[0];
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
