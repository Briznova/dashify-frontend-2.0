import { SchoolDashboardView } from "@/components/school-dashboard";

export function SuperAdminWorkspace({ userName }: { userName: string }) {
  return <SchoolDashboardView role="super_admin" userName={userName} />;
}
