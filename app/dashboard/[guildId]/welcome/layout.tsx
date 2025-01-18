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
  if (!welcomer) return <div>Welcomer not enabled</div>;
  const cards = await getModuleCards(welcomer?.id, "welcomer");

  return (
    <ModuleInitialiser
      moduleName="welcomer"
      moduleId={welcomer.id}
      cards={cards}
    >
      {children}
    </ModuleInitialiser>
  );
}
