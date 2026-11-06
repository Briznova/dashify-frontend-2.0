import type { Metadata } from "next";
import { SchoolsDirectory } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Schools" };

export default function SchoolsPage() {
  return <SchoolsDirectory />;
}
