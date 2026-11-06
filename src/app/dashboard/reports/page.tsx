import type { Metadata } from "next";
import { AcademicReportsDirectory } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Reports" };

export default function Reports() {
  return <AcademicReportsDirectory />;
}
