import { SchoolDashboardView } from "@/components/school-dashboard";

export function SchoolAdminWorkspace({ userName }: { userName: string }) {
  return <SchoolDashboardView role="school_admin" userName={userName} />;
}
