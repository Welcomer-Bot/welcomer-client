import ModuleInitialiser from "@/components/dashboard/guild/moduleInitialiser";
import { getLeaver, getModuleCards } from "@/lib/dal";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    guildId: string;
  }>;
}) {
  const { guildId } = await params;
  const leaver = await getLeaver(guildId);
  if (!leaver) return <div>Module not found, please enable it first</div>;
  const cards = await getModuleCards(leaver?.id, "leaver");

  return (
    <ModuleInitialiser
      moduleName="leaver"
      moduleId={leaver?.id}
      cards={cards}
      activeCardId={leaver?.activeCardId}
    >
      {children}
    </ModuleInitialiser>
  );
}
