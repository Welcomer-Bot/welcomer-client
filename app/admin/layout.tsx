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
