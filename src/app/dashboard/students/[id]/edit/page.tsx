import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentForm } from "@/components/student-record";

export const metadata: Metadata = { title: "Edit student" };

async function EditStudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentForm studentId={id} />;
}

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div role="status">Loading student record…</div>}>
      <EditStudentDetails params={params} />
    </Suspense>
  );
}
