import type { Metadata } from "next";
import { AcademicsDirectory } from "@/components/school-extras";

export const metadata: Metadata = { title: "Academics & assignments" };

export default function AcademicsPage() {
  return <AcademicsDirectory />;
}
