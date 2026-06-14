/**
 * Admin Dashboard - User Search
 *
 * Point d'entrée principal pour l'administration.
 * Permet de rechercher et gérer les utilisateurs.
 *
 * @see components/admin/user-search.tsx
 * @see lib/dal.ts#getUsers()
 */

import { UserSearch } from "@/components/admin";
import { getUsers } from "@/lib/dal/session";
import { cookies } from "next/headers";

export default async function Page() {
  await cookies(); // Access request data to opt out of static rendering
  const users = await getUsers();
  return (
    <div className="p-4">
      <h1>Admin Dashboard</h1>
      {users ? <UserSearch users={users} /> : <p>No users found</p>}
    </div>
  );
}
