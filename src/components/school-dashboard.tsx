"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  useAcademicReports,
  useAttendance,
  useClassrooms,
  useSchoolOverview,
  useSchoolSettings,
  useFees,
  useSchools,
  useStaff,
  useStudents,
  useUpdateSchoolSettings,
} from "@/hooks/use-school-data";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Icon } from "@/components/ui/icon";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeading } from "@/components/ui/page-heading";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  AcademicReport,
  AttendanceRecord,
  Classroom,
  FeeRecord,
  School,
  SchoolEvent,
  SchoolOverview,
  SchoolRole,
  SchoolSettingsData,
  StaffMember,
  Student,
} from "@/types/school";
import styles from "./school-dashboard.module.css";

const roleLabels: Record<SchoolRole, string> = {
  super_admin: "Super administrator",
  school_admin: "School administrator",
  principal: "Principal",
};
function RoleDashboard({ sessionRole, userName }: { sessionRole: SchoolRole; userName: string }) {
  const role = sessionRole;
  const { data, isLoading, error, refresh } = useSchoolOverview(role);
  const maxEnrollment = Math.max(...(data?.enrollment.map((point) => point.students) ?? [1]));
  const points = data?.enrollment.map((point, index) => {
    const x = data.enrollment.length === 1 ? 50 : (index / (data.enrollment.length - 1)) * 100;
    const y = 93 - (point.students / maxEnrollment) * 70;
    return `${x},${y}`;
  }).join(" ") ?? "";

  return (
    <>
      <PageHeading
        eyebrow={`${data?.schoolName ?? "SCHOOL WORKSPACE"} · ${roleLabels[role].toUpperCase()}`}
        title={`Good morning, ${userName.trim().split(/\s+/)[0]} ✨`}
        description={role === "super_admin"
          ? "Monitor school workspaces, onboarding, and network-wide performance."
          : role === "principal"
            ? "A school-wide view of learning, classroom activity, and student wellbeing."
            : "Your school at a glance: attendance, fees, enrollment, and daily operations."}
      />
      <ResourceState error={error} isLoading={isLoading} onRetry={refresh} />
      {data && (
        <section className={styles.metricsGrid} aria-label={`${roleLabels[role]} summary`}>
          {data.metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              detail={metric.change}
              trend={metric.positive ? "positive" : "negative"}
              icon={metric.icon}
              tone={metric.tone}
            />
          ))}
        </section>
      )}
      {data && role === "super_admin" && <SuperAdminWorkspace data={data} points={points} />}
      {data && role === "school_admin" && <SchoolAdminWorkspace events={data.upcomingEvents} approvals={data.pendingApprovals} />}
      {data && role === "principal" && <PrincipalWorkspace events={data.upcomingEvents} approvals={data.pendingApprovals} />}
    </>
  );
}

function DashboardPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <div><h2>{title}</h2><p>{description}</p></div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EnrollmentChart({ data, points }: { data: ReturnType<typeof useSchoolOverview>["data"]; points: string }) {
  if (!data) return null;
  return (
    <>
      <div className={styles.enrollmentSummary}>
        <strong>{data.enrollment.at(-1)?.students.toLocaleString()}</strong>
        <span>students enrolled</span>
        <span className={styles.positiveTag}>↗ 8.4% this term</span>
      </div>
      <div className={styles.chart} role="img" aria-label="Student enrollment chart">
        <div className={styles.chartGrid} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} fill="none" stroke="#5873ef" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={styles.chartMonths}>{data.enrollment.map((point) => <span key={point.month}>{point.month}</span>)}</div>
      </div>
    </>
  );
}

function SchoolAdminWorkspace({ events, approvals }: { events: SchoolEvent[]; approvals: SchoolOverview["pendingApprovals"] }) {
  const students = useStudents();
  const attendance = useAttendance();
  const fees = useFees();
  const lowAttendance = students.data?.filter((student) => {
    const rate = Number.parseFloat(student.attendance);
    return Number.isFinite(rate) && rate < 90;
  }) ?? [];
  const collected = fees.data?.filter((fee) => fee.status === "Paid").reduce((sum, fee) => sum + fee.amount, 0) ?? 0;
  const expected = fees.data?.reduce((sum, fee) => sum + fee.amount, 0) ?? 0;
  const collectionRate = expected > 0 ? Math.round((collected / expected) * 100) : 0;

  return (
    <>
      {students.data && lowAttendance.length > 0 && (
        <section className={styles.attendanceAlert} aria-label="Attendance alert">
          <span className={styles.alertIcon}><Icon name="alert" size={17} /></span>
          <div>
            <strong>{lowAttendance.length} students need attendance follow-up</strong>
            <p>{lowAttendance.slice(0, 3).map((student) => `${student.name} (${student.attendance})`).join(" · ")}</p>
          </div>
          <Link href="/dashboard/attendance">Review attendance <Icon name="arrowUpRight" size={14} /></Link>
        </section>
      )}
      {students.error && <ResourceState error={students.error} isLoading={false} onRetry={students.refresh} />}
      <div className={styles.dashboardGrid}>
        <DashboardPanel
          title="Today’s attendance"
          description="Daily attendance recorded across your school."
          action={<Link href="/dashboard/attendance">Open attendance <Icon name="arrowUpRight" size={14} /></Link>}
        >
          <ResourceState error={attendance.error} isLoading={attendance.isLoading} onRetry={attendance.refresh} />
          {attendance.data && (
            <div className={styles.dashboardTableScroll}>
              <table className={styles.dashboardTable}>
                <thead><tr><th>DATE</th><th>PRESENT</th><th>ABSENT</th><th>LATE</th><th>RATE</th></tr></thead>
                <tbody>
                  {attendance.data.slice(0, 4).map((record) => (
                    <tr key={record.id}>
                      <td><strong>{record.date}</strong><small>{record.grade}</small></td>
                      <td>{record.present.toLocaleString()}</td>
                      <td>{record.absent}</td>
                      <td>{record.late}</td>
                      <td><span className={styles.rateValue}>{record.rate}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardPanel>
        <DashboardPanel
          title="Fee position"
          description="Collection progress for the current school year."
          action={<Link href="/dashboard/fees">View fees <Icon name="arrowUpRight" size={14} /></Link>}
        >
          <ResourceState error={fees.error} isLoading={fees.isLoading} onRetry={fees.refresh} />
          {fees.data && (
            <div className={styles.feeSummary}>
              <div className={styles.feeTotal}><strong>${collected.toLocaleString()}</strong><span>of ${expected.toLocaleString()} in invoices</span></div>
              <div className={styles.feeProgress} role="progressbar" aria-label="Fees collected" aria-valuenow={collectionRate} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${collectionRate}%` }} />
              </div>
              <div className={styles.feeLegend}>
                <span><i className={styles.paidDot} />Collected <strong>{collectionRate}%</strong></span>
                <span><i className={styles.dueDot} />Open balances <strong>{fees.data.filter((fee) => fee.status !== "Paid").length}</strong></span>
              </div>
              <div className={styles.feeRows}>
                {fees.data.slice(0, 3).map((fee) => <FeeRow fee={fee} key={fee.id} />)}
              </div>
            </div>
          )}
        </DashboardPanel>
        <DashboardPanel title="Notices & upcoming" description="Keep up with school events and announcements." action={<Link href="/dashboard/reports">View calendar <span aria-hidden="true">↗</span></Link>}>
          <EventList events={events} />
        </DashboardPanel>
        <DashboardPanel title="Enrollment requests" description="New students waiting for your review." action={<Link href="/dashboard/students">Open directory <span aria-hidden="true">↗</span></Link>}>
          <ApprovalList approvals={approvals} />
        </DashboardPanel>
      </div>
    </>
  );
}

function FeeRow({ fee }: { fee: FeeRecord }) {
  return (
    <div className={styles.feeRow}>
      <span className={styles.studentAvatar}>{fee.studentName.split(" ").map((part) => part[0]).join("")}</span>
      <span className={styles.feeRowInfo}><strong>{fee.studentName}</strong><small>{fee.invoiceNumber}</small></span>
      <span className={styles.feeRowAmount}>${fee.amount.toLocaleString()}</span>
      <StatusBadge variant={fee.status === "Paid" ? "success" : fee.status === "Overdue" ? "warning" : "info"}>{fee.status}</StatusBadge>
    </div>
  );
}

function EventList({ events }: { events: SchoolEvent[] }) {
  return (
    <div className={styles.eventList}>
      {events.map((event) => (
        <div className={styles.eventRow} key={event.id}>
          <span className={styles.eventDate}>{event.date.split(" ")[0]}<strong>{event.date.split(" ")[1]}</strong></span>
          <div><strong>{event.title}</strong><span>{event.time} · {event.type}</span></div>
          <span className={styles.eventArrow}><Icon name="arrowUpRight" size={15} /></span>
        </div>
      ))}
    </div>
  );
}

function ApprovalList({ approvals }: { approvals: SchoolOverview["pendingApprovals"] }) {
  return (
    <div className={styles.approvalList}>
      {approvals.slice(0, 3).map((approval) => (
        <div className={styles.approvalRow} key={approval.id}>
          <span className={styles.studentAvatar}>{approval.studentName.split(" ").map((part) => part[0]).join("")}</span>
          <div className={styles.approvalInfo}><strong>{approval.studentName}</strong><span>{approval.grade} · {approval.submittedAt}</span></div>
          <StatusBadge variant={approval.status === "Pending review" ? "warning" : "info"}>{approval.status}</StatusBadge>
        </div>
      ))}
      {approvals.length === 0 && <div className={styles.emptyState}>No students are waiting for approval.</div>}
    </div>
  );
}

function SuperAdminWorkspace({ data, points }: { data: NonNullable<ReturnType<typeof useSchoolOverview>["data"]>; points: string }) {
  const schools = useSchools();
  return (
    <div className={styles.dashboardGrid}>
      <DashboardPanel title="Enrollment across schools" description="Student growth across every workspace." action={<Link href="/dashboard/schools">Manage schools <Icon name="arrowUpRight" size={14} /></Link>}>
        <EnrollmentChart data={data} points={points} />
      </DashboardPanel>
      <DashboardPanel title="Platform notices" description="Setup and account activity that may need attention.">
        <div className={styles.platformNotices}>
          <div><span className={`${styles.noticeIcon} ${styles.noticeWarning}`}><Icon name="alert" size={16} /></span><p><strong>School setup in progress</strong><small>Summit Preparatory still needs to finish onboarding.</small></p><StatusBadge variant="warning">Action needed</StatusBadge></div>
          <div><span className={`${styles.noticeIcon} ${styles.noticeSuccess}`}><Icon name="check" size={16} /></span><p><strong>Term activity is healthy</strong><small>Attendance is up 1.2% across the network this term.</small></p><StatusBadge variant="success">On track</StatusBadge></div>
        </div>
      </DashboardPanel>
      <DashboardPanel title="School portfolio" description="Workspace status and enrollment at a glance." action={<Link href="/dashboard/schools">View all schools <Icon name="arrowUpRight" size={14} /></Link>}>
        <ResourceState error={schools.error} isLoading={schools.isLoading} onRetry={schools.refresh} />
        {schools.data && (
          <div className={styles.dashboardTableScroll}>
            <table className={styles.dashboardTable}>
              <thead><tr><th>SCHOOL</th><th>PRINCIPAL</th><th>STUDENTS</th><th>STAFF</th><th>STATUS</th></tr></thead>
              <tbody>{schools.data.map((school) => (
                <tr key={school.id}>
                  <td><strong>{school.name}</strong><small>{school.location}</small></td>
                  <td>{school.principal}</td><td>{school.students.toLocaleString()}</td><td>{school.staff}</td>
                  <td><StatusBadge variant={school.status === "Active" ? "success" : "warning"}>{school.status}</StatusBadge></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </DashboardPanel>
      <DashboardPanel title="Network activity" description="Recent enrollment decisions and upcoming milestones.">
        <ApprovalList approvals={data.pendingApprovals} />
        <EventList events={data.upcomingEvents.slice(0, 2)} />
      </DashboardPanel>
    </div>
  );
}

function PrincipalWorkspace({ events, approvals }: { events: SchoolEvent[]; approvals: SchoolOverview["pendingApprovals"] }) {
  const classrooms = useClassrooms();
  const reports = useAcademicReports();
  const attendance = useAttendance();
  return (
    <div className={styles.dashboardGrid}>
      <DashboardPanel title="Classroom pulse" description="Classes in session and the staff leading them." action={<Link href="/dashboard/classes">View classes <Icon name="arrowUpRight" size={14} /></Link>}>
        <ResourceState error={classrooms.error} isLoading={classrooms.isLoading} onRetry={classrooms.refresh} />
        {classrooms.data && (
          <div className={styles.classroomList}>
            {classrooms.data.slice(0, 4).map((room) => (
              <div className={styles.classroomRow} key={room.id}>
                <span className={styles.classroomIcon}><Icon name="book" size={16} /></span>
                <span><strong>{room.name}</strong><small>{room.homeroomTeacher} · {room.students} students</small></span>
                <StatusBadge variant={room.status === "In session" ? "success" : "info"}>{room.status}</StatusBadge>
              </div>
            ))}
          </div>
        )}
      </DashboardPanel>
      <DashboardPanel title="Attendance watch" description="School-wide daily attendance trends." action={<Link href="/dashboard/attendance">Review attendance <Icon name="arrowUpRight" size={14} /></Link>}>
        <ResourceState error={attendance.error} isLoading={attendance.isLoading} onRetry={attendance.refresh} />
        {attendance.data && (
          <div className={styles.attendanceWatch}>
            {attendance.data.slice(0, 3).map((record) => (
              <div key={record.id}><span>{record.date}</span><strong>{record.rate}</strong><small>{record.absent} absent · {record.late} late</small></div>
            ))}
          </div>
        )}
      </DashboardPanel>
      <DashboardPanel title="Academic reports" description="Latest school performance and progress reports." action={<Link href="/dashboard/analytics">Open analytics <Icon name="arrowUpRight" size={14} /></Link>}>
        <ResourceState error={reports.error} isLoading={reports.isLoading} onRetry={reports.refresh} />
        {reports.data && (
          <div className={styles.reportList}>
            {reports.data.slice(0, 4).map((report) => (
              <div key={report.id}><span className={styles.reportIcon}><Icon name="file" size={16} /></span><span><strong>{report.title}</strong><small>{report.category} · Updated {report.updatedAt}</small></span><span className={styles.eventArrow}><Icon name="arrowUpRight" size={15} /></span></div>
            ))}
          </div>
        )}
      </DashboardPanel>
      <DashboardPanel title="Leadership priorities" description="Student support and upcoming school commitments." action={<Link href="/dashboard/students">Review students <Icon name="arrowUpRight" size={14} /></Link>}>
        <ApprovalList approvals={approvals} />
        <EventList events={events.slice(0, 2)} />
      </DashboardPanel>
    </div>
  );
}

type Column<T> = DataTableColumn<T>;

function DirectoryTable<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  isLoading,
  error,
  refresh,
  searchText,
  headingAction,
}: {
  title: string;
  description: string;
  rows: T[] | null;
  columns: Column<T>[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  searchText: (row: T) => string;
  headingAction?: ReactNode;
}) {
  return (
    <>
      <PageHeading eyebrow="SCHOOL MANAGEMENT" title={title} description={description}>
        <div className={styles.pageActions}>
          {headingAction}
          <button className={styles.outlineButton} type="button" onClick={refresh} disabled={isLoading}>
            <Icon className={isLoading ? styles.refreshing : undefined} name="refresh" size={16} />
            {isLoading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </PageHeading>
      <DataTable
        title={title}
        description={rows ? `${rows.length} records` : description}
        rows={rows}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        searchText={searchText}
      />
    </>
  );
}

export function StudentsDirectory() {
  const resource = useStudents();
  const columns: Column<Student>[] = [
    { heading: "STUDENT", render: (row) => <span className={styles.tablePerson}><i>{row.name.split(" ").map((part) => part[0]).join("")}</i><span><Link className={styles.studentLink} href={`/dashboard/students/${row.id}`}>{row.name}</Link><small>{row.studentNumber}</small></span></span> },
    { heading: "GRADE", render: (row) => row.grade },
    { heading: "PARENT / GUARDIAN", render: (row) => row.guardian },
    { heading: "ATTENDANCE", render: (row) => row.attendance },
    { heading: "STATUS", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
  ];
  return <DirectoryTable title="Students" description="Manage student profiles, enrollment, and academic information." rows={resource.data} columns={columns} isLoading={resource.isLoading} error={resource.error} refresh={resource.refresh} searchText={(row) => `${row.name} ${row.studentNumber} ${row.grade} ${row.guardian}`} headingAction={<Link className={styles.primaryButton} href="/dashboard/students/new">+ Add student</Link>} />;
}

export function StaffDirectory() {
  const resource = useStaff();
  const columns: Column<StaffMember>[] = [
    { heading: "STAFF MEMBER", render: (row) => <span className={styles.tablePerson}><i>{row.name.split(" ").map((part) => part[0]).join("")}</i><span><strong>{row.name}</strong><small>{row.email}</small></span></span> },
    { heading: "POSITION", render: (row) => row.position },
    { heading: "DEPARTMENT", render: (row) => row.department },
    { heading: "STATUS", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
  ];
  return <DirectoryTable title="Staff" description="View teachers and school staff across your community." rows={resource.data} columns={columns} isLoading={resource.isLoading} error={resource.error} refresh={resource.refresh} searchText={(row) => `${row.name} ${row.email} ${row.position} ${row.department}`} />;
}

export function ClassroomsDirectory() {
  const resource = useClassrooms();
  const columns: Column<Classroom>[] = [
    { heading: "CLASS", render: (row) => <strong className={styles.tableStrong}>{row.name}</strong> },
    { heading: "GRADE", render: (row) => row.grade },
    { heading: "HOMEROOM TEACHER", render: (row) => row.homeroomTeacher },
    { heading: "STUDENTS", render: (row) => row.students },
    { heading: "SCHEDULE", render: (row) => row.schedule },
    { heading: "STATUS", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
  ];
  return <DirectoryTable title="Classes & grades" description="Organize classrooms, grade levels, and homeroom teachers." rows={resource.data} columns={columns} isLoading={resource.isLoading} error={resource.error} refresh={resource.refresh} searchText={(row) => `${row.name} ${row.grade} ${row.homeroomTeacher}`} />;
}

export function SchoolsDirectory() {
  const resource = useSchools();
  const columns: Column<School>[] = [
    { heading: "SCHOOL", render: (row) => <span className={styles.schoolName}><strong>{row.name}</strong><small>{row.id}</small></span> },
    { heading: "LOCATION", render: (row) => row.location },
    { heading: "PRINCIPAL", render: (row) => row.principal },
    { heading: "STUDENTS", render: (row) => row.students.toLocaleString() },
    { heading: "STAFF", render: (row) => row.staff },
    { heading: "STATUS", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
  ];
  return <DirectoryTable title="Schools" description="Oversee school locations, leadership, and enrollment." rows={resource.data} columns={columns} isLoading={resource.isLoading} error={resource.error} refresh={resource.refresh} searchText={(row) => `${row.name} ${row.location} ${row.principal}`} />;
}

export function AttendanceDirectory() {
  const resource = useAttendance();
  const columns: Column<AttendanceRecord>[] = [
    { heading: "DATE", render: (row) => <strong className={styles.tableStrong}>{row.date}</strong> },
    { heading: "GRADE", render: (row) => row.grade },
    { heading: "PRESENT", render: (row) => row.present.toLocaleString() },
    { heading: "ABSENT", render: (row) => row.absent },
    { heading: "LATE", render: (row) => row.late },
    { heading: "ATTENDANCE RATE", render: (row) => <strong className={styles.rateValue}>{row.rate}</strong> },
  ];
  return <DirectoryTable title="Attendance" description="Monitor attendance and spot patterns across grade levels." rows={resource.data} columns={columns} isLoading={resource.isLoading} error={resource.error} refresh={resource.refresh} searchText={(row) => `${row.date} ${row.grade} ${row.rate}`} />;
}

export function AcademicReportsDirectory() {
  const resource = useAcademicReports();
  const columns: Column<AcademicReport>[] = [
    { heading: "REPORT", render: (row) => <strong className={styles.tableStrong}>{row.title}</strong> },
    { heading: "CATEGORY", render: (row) => row.category },
    { heading: "LAST UPDATED", render: (row) => row.updatedAt },
    { heading: "OWNER", render: (row) => row.owner },
    { heading: "ACTION", render: () => <span className={styles.reportAction}>Open report ↗</span> },
  ];
  return <DirectoryTable title="Academic reports" description="Review enrollment, attendance, and academic performance." rows={resource.data} columns={columns} isLoading={resource.isLoading} error={resource.error} refresh={resource.refresh} searchText={(row) => `${row.title} ${row.category} ${row.owner}`} />;
}

export function AcademicAnalytics() {
  const resource = useAttendance();
  const average = resource.data?.length
    ? `${(resource.data.reduce((sum, row) => sum + Number.parseFloat(row.rate), 0) / resource.data.length).toFixed(1)}%`
    : "—";
  return (
    <>
      <PageHeading eyebrow="SCHOOL PERFORMANCE" title="Academic analytics" description="Understand attendance and enrollment trends across your school.">
        <button className={styles.outlineButton} type="button" onClick={resource.refresh} disabled={resource.isLoading}>
          <Icon className={resource.isLoading ? styles.refreshing : undefined} name="refresh" size={16} />
          {resource.isLoading ? "Refreshing…" : "Refresh"}
        </button>
      </PageHeading>
      <ResourceState error={resource.error} isLoading={resource.isLoading} onRetry={resource.refresh} />
      {resource.data && <>
        <div className={styles.metricsGrid}>
          <MetricCard label="Average attendance" value={average} detail="Across recent school days" icon="calendarCheck" tone="green" />
          <MetricCard label="Students present today" value={resource.data[0]?.present.toLocaleString() ?? "—"} detail="Latest attendance record" icon="users" tone="blue" />
          <MetricCard label="Students absent today" value={resource.data[0]?.absent.toLocaleString() ?? "—"} detail="Latest attendance record" icon="clock" tone="orange" />
          <MetricCard label="Late arrivals" value={resource.data[0]?.late.toLocaleString() ?? "—"} detail="Latest attendance record" icon="chart" tone="violet" />
        </div>
        <section className={styles.panel}><div className={styles.panelHeading}><div><h2>Recent attendance</h2><p>Daily school attendance summary.</p></div><Link href="/dashboard/attendance">Full attendance <span aria-hidden="true">↗</span></Link></div><div className={styles.tableScroll}><table className={styles.table}><thead><tr><th>DATE</th><th>PRESENT</th><th>ABSENT</th><th>LATE</th><th>ATTENDANCE RATE</th></tr></thead><tbody>{resource.data.map((row) => <tr key={row.id}><td>{row.date}</td><td>{row.present.toLocaleString()}</td><td>{row.absent}</td><td>{row.late}</td><td><strong className={styles.rateValue}>{row.rate}</strong></td></tr>)}</tbody></table></div></section>
      </>}
    </>
  );
}

export function SchoolSettings() {
  const resource = useSchoolSettings();
  const { update, isPending, error } = useUpdateSchoolSettings();
  const [draftSettings, setDraftSettings] = useState<SchoolSettingsData | null>(null);
  const [saved, setSaved] = useState(false);
  const settings = draftSettings ?? resource.data;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    const updated = await update(settings);
    if (updated) {
      setDraftSettings(updated);
      setSaved(true);
    }
  }

  return (
    <>
      <PageHeading eyebrow="SCHOOL WORKSPACE" title="Settings" description="Manage school profile and workspace preferences." />
      <ResourceState error={resource.error} isLoading={resource.isLoading} onRetry={resource.refresh} />
      {settings && <>
        <form onSubmit={handleSubmit}>
          <section className={styles.settingsCard}>
            <div><h2>School profile</h2><p>Update your institution details and the information your community sees.</p></div>
            <div className={styles.settingsGrid}>
              <label>School name<input value={settings.schoolName} onChange={(event) => { setDraftSettings({ ...settings, schoolName: event.target.value }); setSaved(false); }} required /></label>
              <label>School email<input type="email" value={settings.email} onChange={(event) => { setDraftSettings({ ...settings, email: event.target.value }); setSaved(false); }} required /></label>
              <label>School type<select value={settings.schoolType} onChange={(event) => { if (event.target.value === "private" || event.target.value === "public" || event.target.value === "charter") setDraftSettings({ ...settings, schoolType: event.target.value }); setSaved(false); }}><option value="private">Private school</option><option value="public">Public school</option><option value="charter">Charter school</option></select></label>
              <label>School year<select value={settings.academicYear} onChange={(event) => { if (event.target.value === "2026-27" || event.target.value === "2025-26") setDraftSettings({ ...settings, academicYear: event.target.value }); setSaved(false); }}><option value="2026-27">2026–2027</option><option value="2025-26">2025–2026</option></select></label>
            </div>
            {error && <div className={styles.errorState} role="alert">{error}</div>}
            <div className={styles.settingsSave}><span>{saved ? "Your school settings are saved." : "Settings are saved to the active service."}</span><button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save changes"}</button></div>
          </section>
          <section className={styles.settingsCard}>
            <div><h2>Notifications</h2><p>Choose which school updates are sent to your inbox.</p></div>
            <label className={styles.preference}><span><strong>Enrollment requests</strong><small>Get notified when a new student applies.</small></span><input type="checkbox" checked={settings.enrollmentNotifications} onChange={(event) => { setDraftSettings({ ...settings, enrollmentNotifications: event.target.checked }); setSaved(false); }} /></label>
            <label className={styles.preference}><span><strong>Daily attendance summary</strong><small>Receive a daily school attendance recap.</small></span><input type="checkbox" checked={settings.attendanceNotifications} onChange={(event) => { setDraftSettings({ ...settings, attendanceNotifications: event.target.checked }); setSaved(false); }} /></label>
          </section>
          <section className={styles.settingsCard}>
            <div>
              <h2>School roles & permissions</h2>
              <p>Review the access each member role is designed to have.</p>
            </div>
            <div className={styles.roleList}>
              {[
                ["School administrator", "School profile, people, classes, and settings"],
                ["Principal", "Academic overview, attendance, and student support"],
                ["Teacher", "Assigned classes, class registers, and coursework"],
                ["Accountant", "Fee collection, invoices, and payment receipts"],
                ["Parent", "Linked child’s attendance, progress, and updates"],
                ["Student", "Personal timetable, assignments, and results"],
              ].map(([role, permissions]) => (
                <div className={styles.roleRow} key={role}>
                  <div><strong>{role}</strong><span>{permissions}</span></div>
                  <StatusBadge variant="info">Preview role</StatusBadge>
                </div>
              ))}
            </div>
            <p className={styles.permissionsNote}>
              These are preview permissions. Enforce role access in your trusted API before production.
            </p>
          </section>
        </form>
      </>}
    </>
  );
}

export function SchoolDashboardView({ role, userName }: { role: SchoolRole; userName: string }) {
  return <RoleDashboard sessionRole={role} userName={userName} />;
}
