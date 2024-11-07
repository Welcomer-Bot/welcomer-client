import NavbarUserDropdown from "./navbarUserDropdown";
import { SignIn } from "./signinButton";

import { getUser } from "@/lib/dal";
import React from "react";

export default async function NavbarUser(): Promise<React.ReactElement> {
  const user = await getUser();

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
