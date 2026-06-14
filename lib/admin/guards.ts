import "server-only";

import { fetchUserFromSession } from "@/lib/dal/session";
import { AppError, ErrorCode } from "@/lib/error";

function getAdminUserIds() {
  return (
    process.env.ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? []
  );
}

export function isAdminUserId(userId: string) {
  return getAdminUserIds().includes(userId);
}

export async function requireAdminUser() {
  const user = await fetchUserFromSession();
  if (!user || !isAdminUserId(user.id)) {
    return null;
  }

  return user;
}

export async function assertAdminUser() {
  const user = await requireAdminUser();
  if (!user) {
    throw new AppError("Unauthorized", ErrorCode.PERMISSION_DENIED, 403, {
      action: "assertAdminUser",
    });
  }
  return user;
}

