import type { Metadata } from "next";
import { PortalDashboard } from "@/components/school-extras";

export const metadata: Metadata = { title: "Teacher portal" };

export default function TeacherPortalPage() {
  return <PortalDashboard role="teacher" />;
}
