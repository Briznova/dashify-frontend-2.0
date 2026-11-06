import type { Metadata } from "next";
import { StudentForm } from "@/components/student-record";

export const metadata: Metadata = { title: "Add student" };

export default function NewStudentPage() {
  return <StudentForm />;
}
