/**
 * Admin Layout
 *
 * Protège toutes les routes /admin/* avec le middleware de vérification d'admin.
 * Redirige vers 404 si l'utilisateur n'est pas admin.
 *
 * @see lib/admin/guards.ts - requireAdminUser()
 */

import { requireAdminUser } from "@/lib/admin/guards";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();
  if (!user) {
    return notFound();
  }
  return <section className="h-screen">{children}</section>;
}
