import type { Metadata } from "next";
import { StudentsDirectory } from "@/components/school-dashboard";

export const metadata: Metadata = { title: "Students" };

export default function Customers() {
  return <StudentsDirectory />;
}
