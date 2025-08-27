import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function Layout({children}: {children: React.ReactNode}) {
    const user = await getUser();
    if (!user) {
        return redirect("/api/auth/login");
    }
    
    return (
        <>
            {children}
        </>
    );
}