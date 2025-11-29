import UserSearch from "@/components/admin/user-search";
import { getUsers } from "@/lib/dal";
import { cookies } from "next/headers";

export default async function Page() {
  await cookies(); // Access request data to opt out of static rendering
  const users = await getUsers();
  return (
    <div className="p-4">
      <h1>Admin Page</h1>
      {users ? <UserSearch users={users} /> : <p>No users found</p>}
    </div>
  );
}
