import type { Metadata } from "next";
import { SchoolSettings } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Settings" };

export default function Settings() {
  return <SchoolSettings />;
}
