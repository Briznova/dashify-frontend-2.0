import type { Metadata } from "next";
import { PortalDashboard } from "@/components/school-extras";

export const metadata: Metadata = { title: "Finance portal" };

export default function AccountantPortalPage() {
  return <PortalDashboard role="accountant" />;
}
