import ModuleInitialiser from "@/components/dashboard/guild/moduleInitialiser";
import { getModuleCards, getWelcomer } from "@/lib/dal";

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
  const welcomer = await getWelcomer(guildId);
  if (!welcomer) return <div>Module not found, please enable it first</div>;
  const cards = await getModuleCards(welcomer?.guildId, "welcomer");

  return (
    <ModuleInitialiser
      moduleName="welcomer"
      moduleId={welcomer?.guildId}
      cards={cards}
      activeCardId={welcomer?.activeCardId}
    >
      {children}
    </ModuleInitialiser>
  );
}
