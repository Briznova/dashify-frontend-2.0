import type { Metadata } from "next";
import { AttendanceDirectory } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return <AttendanceDirectory />;
}
