import type { Metadata } from "next";
import { ClassroomsDirectory } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Classes & grades" };

export default function ClassesPage() {
  return <ClassroomsDirectory />;
}
