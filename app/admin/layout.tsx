import { fetchUserFromSession } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchUserFromSession();
  if (!user || user.id !== "479216487173980160") {
    return notFound();
  }
  return <section className="h-screen">{children}</section>;
}
