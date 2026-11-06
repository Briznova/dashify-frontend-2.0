import type { IconName } from "@/components/ui/icon";

export type SchoolRole = "super_admin" | "school_admin" | "principal";
export type PortalRole = "teacher" | "accountant" | "parent" | "student";

export type SchoolMetric = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: IconName;
  tone: "blue" | "violet" | "green" | "orange";
};

export type EnrollmentPoint = {
  month: string;
  students: number;
};

export type PendingApproval = {
  id: string;
  studentName: string;
  grade: string;
  submittedAt: string;
  status: "Pending review" | "Needs information";
};

export type SchoolEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Academic" | "School" | "Meeting";
};

export type SchoolOverview = {
  role: SchoolRole;
  schoolName: string;
  metrics: SchoolMetric[];
  enrollment: EnrollmentPoint[];
  pendingApprovals: PendingApproval[];
  upcomingEvents: SchoolEvent[];
};

export type Student = {
  id: string;
  name: string;
  studentNumber: string;
  grade: string;
  guardian: string;
  attendance: string;
  status: "Active" | "Pending" | "On leave";
};

export type StudentInput = Pick<
  Student,
  "name" | "studentNumber" | "grade" | "guardian"
>;

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: "Active" | "On leave";
};

export type Classroom = {
  id: string;
  name: string;
  grade: string;
  homeroomTeacher: string;
  students: number;
  schedule: string;
  status: "In session" | "Upcoming";
};

export type School = {
  id: string;
  name: string;
  location: string;
  principal: string;
  students: number;
  staff: number;
  status: "Active" | "Setup in progress";
};

export type AttendanceRecord = {
  id: string;
  date: string;
  grade: string;
  present: number;
  absent: number;
  late: number;
  rate: string;
};

export type AcademicReport = {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  owner: string;
};

export type SchoolSettingsData = {
  schoolName: string;
  email: string;
  schoolType: "private" | "public" | "charter";
  academicYear: "2026-27" | "2025-26";
  enrollmentNotifications: boolean;
  attendanceNotifications: boolean;
};

export type PortalAction = {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: string;
};

export type PortalOverview = {
  role: PortalRole;
  greeting: string;
  schoolName: string;
  metrics: SchoolMetric[];
  primaryTitle: string;
  primaryDescription: string;
  primaryItems: PortalAction[];
  secondaryTitle: string;
  secondaryItems: PortalAction[];
};

export type FeeRecord = {
  id: string;
  studentName: string;
  studentNumber: string;
  grade: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
};

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  submissions: string;
  status: "Published" | "Due soon" | "Draft";
};
