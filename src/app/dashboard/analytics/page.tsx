import type { Metadata } from "next";
import { AcademicAnalytics } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Academic analytics" };

export default function Analytics() {
  return <AcademicAnalytics />;
}
