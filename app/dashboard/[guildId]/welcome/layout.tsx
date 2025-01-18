import ModuleInitialiser from "@/components/dashboard/guild/moduleInitialiser";
import { getWelcomer } from "@/lib/dal";

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
    if (!welcomer) return null;
    
    return (
        <ModuleInitialiser moduleName="welcomer" moduleId={welcomer.id}>
            {children}
        </ModuleInitialiser>
    );
}
