import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentProfile } from "@/components/student-record";

export const metadata: Metadata = { title: "Student profile" };

async function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentProfile studentId={id} />;
}

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div role="status">Loading student profile…</div>}>
      <StudentDetails params={params} />
    </Suspense>
  );
}
