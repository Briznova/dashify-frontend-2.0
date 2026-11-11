import { SchoolDashboardView } from "@/components/school-dashboard";

export function PrincipalWorkspace({ userName }: { userName: string }) {
  return <SchoolDashboardView role="principal" userName={userName} />;
}
