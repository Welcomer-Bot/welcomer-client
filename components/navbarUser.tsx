import { getUserData } from "@/lib/dto";
import NavbarUserDropdown from "./navbarUserDropdown";
import { SignIn } from "./signinButton";


export default async function NavbarUser(): Promise<JSX.Element> {
  const user = await getUserData();

  if (!user)
    return (
      <div>
        <SignIn />
      </div>
    );

  return (
    <span>
      <NavbarUserDropdown user={user} />
    </span>
  );
}