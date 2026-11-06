import type { Metadata } from "next";
import { StaffDirectory } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Staff" };

export default function StaffPage() {
  return <StaffDirectory />;
}
