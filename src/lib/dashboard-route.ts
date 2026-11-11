import { getRoleHomePath, type UserRole } from "@/modules/access";

export function getDashboardRoute(role: UserRole) {
  return getRoleHomePath(role);
}
