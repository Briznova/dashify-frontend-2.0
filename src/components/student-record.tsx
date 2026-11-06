"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAssignments, useFees, useSaveStudent, useStudents } from "@/hooks/use-school-data";
import type { StudentInput } from "@/types/school";
import { PageHeading } from "@/components/ui/page-heading";
import { Icon } from "@/components/ui/icon";
import { Panel } from "@/components/ui/panel";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import styles from "./student-record.module.css";

const emptyStudent: StudentInput = {
  name: "",
  studentNumber: "",
  grade: "",
  guardian: "",
};

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function StudentProfile({ studentId }: { studentId: string }) {
  const students = useStudents();
  const fees = useFees();
  const assignments = useAssignments();
  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "attendance" | "documents">("overview");
  const student = students.data?.find((item) => item.id === studentId);
  const studentFees = fees.data?.filter((fee) => fee.studentNumber === student?.studentNumber) ?? [];

  return (
    <>
      <PageHeading
        eyebrow="STUDENT DIRECTORY"
        title={student?.name ?? "Student profile"}
        description="A complete view of a student’s school journey and key information."
      >
        {student && (
          <Link className={styles.primaryLink} href={`/dashboard/students/${student.id}/edit`}>
            Edit profile <Icon name="arrowUpRight" size={14} />
          </Link>
        )}
      </PageHeading>
      <ResourceState
        error={students.error}
        isLoading={students.isLoading}
        onRetry={students.refresh}
      />
      {students.data && !student && (
        <div className={styles.notFound} role="status">
          This student is not in the current school directory.
          <Link href="/dashboard/students">Return to students</Link>
        </div>
      )}
      {student && (
        <>
          <section className={styles.profileHero}>
            <span className={styles.avatar}>{initials(student.name)}</span>
            <div className={styles.profileIdentity}>
              <div><h2>{student.name}</h2><StatusBadge>{student.status}</StatusBadge></div>
              <p>{student.studentNumber} <span aria-hidden="true">·</span> {student.grade}</p>
            </div>
            <div className={styles.profileStat}><span>Attendance</span><strong>{student.attendance}</strong></div>
            <div className={styles.profileStat}><span>Fee balance</span><strong>{studentFees.filter((fee) => fee.status !== "Paid").reduce((sum, fee) => sum + fee.amount, 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</strong></div>
          </section>
          <nav className={styles.tabs} aria-label="Student profile sections">
            {(["overview", "academics", "attendance", "documents"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                aria-current={activeTab === tab ? "page" : undefined}
                className={activeTab === tab ? styles.tabActive : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "attendance" ? "Attendance & fees" : tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          {activeTab === "overview" && (
            <div className={styles.profileGrid}>
              <Panel title="Student information" description="Personal and enrollment details.">
                <dl className={styles.detailList}>
                  <div><dt>Student name</dt><dd>{student.name}</dd></div>
                  <div><dt>Student ID</dt><dd>{student.studentNumber}</dd></div>
                  <div><dt>Grade & class</dt><dd>{student.grade} · Section A</dd></div>
                  <div><dt>Enrollment status</dt><dd><StatusBadge>{student.status}</StatusBadge></dd></div>
                </dl>
              </Panel>
              <Panel title="Parent / guardian" description="Primary family contact for this student.">
                <div className={styles.guardianCard}>
                  <span className={styles.guardianAvatar}>{initials(student.guardian)}</span>
                  <div><strong>{student.guardian}</strong><p>Primary guardian · contact details managed by the school</p></div>
                </div>
              </Panel>
            </div>
          )}
          {activeTab === "academics" && (
            <Panel title="Academic history" description="Recent coursework and learning progress.">
              <div className={styles.recordList}>
                {(assignments.data ?? []).slice(0, 3).map((assignment) => (
                  <div className={styles.recordRow} key={assignment.id}>
                    <span className={styles.recordIcon}><Icon name="file" size={17} /></span>
                    <div><strong>{assignment.title}</strong><span>{assignment.subject} · {assignment.className}</span></div>
                    <StatusBadge>{assignment.status}</StatusBadge>
                  </div>
                ))}
                {!assignments.data?.length && <p className={styles.empty}>Academic records will appear here.</p>}
              </div>
            </Panel>
          )}
          {activeTab === "attendance" && (
            <Panel title="Attendance & fees" description="At-a-glance school engagement and account standing.">
              <div className={styles.recordList}>
                <div className={styles.recordRow}><span className={styles.recordIcon}><Icon name="calendarCheck" size={17} /></span><div><strong>Attendance this term</strong><span>Present on {student.attendance} of school days.</span></div><StatusBadge variant="success">{student.attendance}</StatusBadge></div>
                {studentFees.map((fee) => (
                  <div className={styles.recordRow} key={fee.id}>
                    <span className={styles.recordIcon}><Icon name="wallet" size={17} /></span>
                    <div><strong>{fee.invoiceNumber}</strong><span>{fee.dueDate} · ${fee.amount.toLocaleString()}</span></div>
                    <StatusBadge>{fee.status}</StatusBadge>
                  </div>
                ))}
                {!studentFees.length && <p className={styles.empty}>There are no fee records for this student.</p>}
              </div>
            </Panel>
          )}
          {activeTab === "documents" && (
            <Panel title="Student documents" description="Keep enrollment forms and school documents together.">
              <div className={styles.emptyDocument}>
                <span><Icon name="file" size={20} /></span>
                <strong>No documents added yet</strong>
                <p>Student files and consent forms will be available here.</p>
              </div>
            </Panel>
          )}
        </>
      )}
    </>
  );
}

export function StudentForm({ studentId }: { studentId?: string }) {
  const router = useRouter();
  const students = useStudents();
  const mutation = useSaveStudent();
  const existing = students.data?.find((student) => student.id === studentId);
  const [draft, setDraft] = useState<StudentInput | null>(null);
  const form = draft ?? (existing
    ? {
        name: existing.name,
        studentNumber: existing.studentNumber,
        grade: existing.grade,
        guardian: existing.guardian,
      }
    : emptyStudent);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = {
      name: form.name.trim(),
      studentNumber: form.studentNumber.trim(),
      grade: form.grade.trim(),
      guardian: form.guardian.trim(),
    };
    const savedStudent = await mutation.save(studentId ?? null, input);
    if (savedStudent) {
      router.push(`/dashboard/students/${savedStudent.id}`);
      router.refresh();
    }
  }

  const isEditing = Boolean(studentId);

  return (
    <>
      <PageHeading
        eyebrow="STUDENT DIRECTORY"
        title={isEditing ? "Edit student" : "Add a student"}
        description={isEditing ? "Keep this student’s school record up to date." : "Create a student profile and connect their family to school."}
      />
      {isEditing && (
        <ResourceState
          error={students.error}
          isLoading={students.isLoading}
          onRetry={students.refresh}
        />
      )}
      {(!isEditing || existing) && (
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <Panel title="Student details" description="Add the information needed to set up this student’s record.">
            <div className={styles.formGrid}>
              <label>Student name<input value={form.name} onChange={(event) => setDraft({ ...form, name: event.target.value })} autoComplete="name" required /></label>
              <label>Student ID<input value={form.studentNumber} onChange={(event) => setDraft({ ...form, studentNumber: event.target.value })} placeholder="e.g. ST-1043" required /></label>
              <label>Grade<select value={form.grade} onChange={(event) => setDraft({ ...form, grade: event.target.value })} required><option value="" disabled>Select a grade</option>{Array.from({ length: 12 }, (_, index) => `Grade ${index + 1}`).map((grade) => <option key={grade}>{grade}</option>)}</select></label>
              <label>Parent / guardian<input value={form.guardian} onChange={(event) => setDraft({ ...form, guardian: event.target.value })} autoComplete="name" required /></label>
            </div>
            {mutation.error && <p className={styles.formError} role="alert">{mutation.error}</p>}
            <div className={styles.formActions}>
              <Link href="/dashboard/students">Cancel</Link>
              <button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving…" : isEditing ? "Save changes" : "Create student"}</button>
            </div>
          </Panel>
        </form>
      )}
      {isEditing && students.data && !existing && (
        <div className={styles.notFound} role="status">
          This student could not be found.
          <Link href="/dashboard/students">Return to students</Link>
        </div>
      )}
    </>
  );
}
