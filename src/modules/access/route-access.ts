import { portalRoutes, getRoleNavigation } from "./navigation";
import type { UserRole } from "./roles";
import { getRolePolicy } from "./role-policy";

export function isRouteAllowed(pathname: string, role: UserRole): boolean {
  const rolePolicy = getRolePolicy(role);

  if (pathname === "/dashboard/settings") {
    return rolePolicy.capabilities.includes("settings.manage");
  }

  const normalizedPath = pathname === "/dashboard/customers"
    ? "/dashboard/students"
    : pathname === "/dashboard/projects"
      ? "/dashboard/classes"
      : pathname;

  const isNavigationAllowed = getRoleNavigation(role).some((item) => {
    const matchesPath = normalizedPath === item.href;
    const matchesNestedPath = item.href !== "/dashboard" && normalizedPath.startsWith(`${item.href}/`);
    return matchesPath || matchesNestedPath;
  });

  if (isNavigationAllowed) {
    return true;
  }

  return pathname === portalRoutes[role];
}
