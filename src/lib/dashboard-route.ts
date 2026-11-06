import type { UserRole } from "@/types/auth";

export function getDashboardRoute(role: UserRole) {
  switch (role) {
    case "teacher":
      return "/dashboard/teacher";
    case "accountant":
      return "/dashboard/accountant";
    case "parent":
      return "/dashboard/parent";
    case "student":
      return "/dashboard/student";
    default:
      return "/dashboard";
  }
}
