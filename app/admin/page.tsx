import { fetchUserFromSession } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function Page() {
  const user = await fetchUserFromSession();
  if (!user || user.id !== "479216487173980160") {
    notFound();
  }
  // const users = await getUser();
  // return (
  //   <div className="p-4">
  //     <h1>Admin Page</h1>
  //     {users ? <UserSearch users={users} /> : <p>No users found</p>}
  //   </div>
  // );
}
