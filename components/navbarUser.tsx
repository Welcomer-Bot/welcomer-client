import NavbarUserDropdown from "./navbarUserDropdown";
import { SignIn } from "./signinButton";

import { fetchUserFromSession } from "@/lib/dal";
import React from "react";

export default async function NavbarUser(): Promise<React.ReactElement> {
  const user = await fetchUserFromSession();
  if (!user)
    return (
      <div>
        <SignIn />
      </div>
    );

  return (
    <span>
      <NavbarUserDropdown user={user.toObject()} />
    </span>
  );
}
