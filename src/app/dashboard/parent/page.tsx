import type { Metadata } from "next";
import { PortalDashboard } from "@/components/school-extras";

export const metadata: Metadata = { title: "Parent portal" };

export default function ParentPortalPage() {
  return <PortalDashboard role="parent" />;
}
