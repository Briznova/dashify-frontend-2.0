import type { Metadata } from "next";
import { PortalDashboard } from "@/components/school-extras";

export const metadata: Metadata = { title: "Student portal" };

export default function StudentPortalPage() {
  return <PortalDashboard role="student" />;
}
