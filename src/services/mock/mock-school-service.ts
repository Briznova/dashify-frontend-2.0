import type { SchoolService } from "@/services/school-service";
import type {
  AcademicReport,
  Assignment,
  AttendanceRecord,
  Classroom,
  FeeRecord,
  PortalOverview,
  PortalRole,
  School,
  SchoolOverview,
  SchoolRole,
  SchoolSettingsData,
  StaffMember,
  Student,
  StudentInput,
} from "@/types/school";

function delay(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("The request was cancelled.", "AbortError"));
      return;
    }

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("The request was cancelled.", "AbortError"));
    };
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, 260);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

const students: Student[] = [
  { id: "stu-1042", name: "Olivia Bennett", studentNumber: "ST-1042", grade: "Grade 8", guardian: "Morgan Bennett", attendance: "96%", status: "Active" },
  { id: "stu-1038", name: "Noah Williams", studentNumber: "ST-1038", grade: "Grade 7", guardian: "Taylor Williams", attendance: "92%", status: "Active" },
  { id: "stu-1032", name: "Ava Thompson", studentNumber: "ST-1032", grade: "Grade 9", guardian: "Jordan Thompson", attendance: "88%", status: "Active" },
  { id: "stu-1026", name: "Liam Anderson", studentNumber: "ST-1026", grade: "Grade 6", guardian: "Casey Anderson", attendance: "—", status: "Pending" },
  { id: "stu-1019", name: "Sophia Martinez", studentNumber: "ST-1019", grade: "Grade 8", guardian: "Riley Martinez", attendance: "97%", status: "Active" },
  { id: "stu-1011", name: "Ethan Wilson", studentNumber: "ST-1011", grade: "Grade 5", guardian: "Alex Wilson", attendance: "84%", status: "On leave" },
];

const staff: StaffMember[] = [
  { id: "stf-201", name: "Avery Johnson", email: "avery.johnson@northstar.edu", position: "Principal", department: "Leadership", status: "Active" },
  { id: "stf-202", name: "Mia Robinson", email: "mia.robinson@northstar.edu", position: "Math teacher", department: "Mathematics", status: "Active" },
  { id: "stf-203", name: "Lucas Clark", email: "lucas.clark@northstar.edu", position: "Science teacher", department: "Science", status: "Active" },
  { id: "stf-204", name: "Isabella Lewis", email: "isabella.lewis@northstar.edu", position: "Counselor", department: "Student support", status: "On leave" },
];

const classrooms: Classroom[] = [
  { id: "CLS-08A", name: "Grade 8 · Section A", grade: "Grade 8", homeroomTeacher: "Mia Robinson", students: 28, schedule: "08:30 AM – 02:45 PM", status: "In session" },
  { id: "CLS-07B", name: "Grade 7 · Section B", grade: "Grade 7", homeroomTeacher: "Lucas Clark", students: 26, schedule: "08:30 AM – 02:45 PM", status: "In session" },
  { id: "CLS-09A", name: "Grade 9 · Section A", grade: "Grade 9", homeroomTeacher: "Avery Johnson", students: 24, schedule: "09:00 AM – 03:15 PM", status: "Upcoming" },
  { id: "CLS-06C", name: "Grade 6 · Section C", grade: "Grade 6", homeroomTeacher: "Mia Robinson", students: 25, schedule: "08:30 AM – 02:45 PM", status: "In session" },
];

const schools: School[] = [
  { id: "SCH-001", name: "Northstar Academy", location: "Portland, Oregon", principal: "Avery Johnson", students: 1284, staff: 86, status: "Active" },
  { id: "SCH-002", name: "Cedar Grove School", location: "Vancouver, Washington", principal: "Morgan Ellis", students: 942, staff: 64, status: "Active" },
  { id: "SCH-003", name: "Summit Preparatory", location: "Salem, Oregon", principal: "Riley Parker", students: 716, staff: 51, status: "Setup in progress" },
];

const attendance: AttendanceRecord[] = [
  { id: "ATT-221A", date: "Today · 08:30 AM", grade: "Primary · Grades 1–3", present: 375, absent: 18, late: 7, rate: "93.8%" },
  { id: "ATT-221B", date: "Today · 08:30 AM", grade: "Elementary · Grades 4–5", present: 312, absent: 14, late: 6, rate: "94.0%" },
  { id: "ATT-221C", date: "Today · 08:30 AM", grade: "Middle · Grades 6–8", present: 330, absent: 14, late: 6, rate: "94.3%" },
  { id: "ATT-221D", date: "Today · 08:30 AM", grade: "High · Grades 9–12", present: 186, absent: 10, late: 6, rate: "92.1%" },
  { id: "ATT-221", date: "Nov 06, 2026", grade: "All grades", present: 1203, absent: 56, late: 25, rate: "93.7%" },
  { id: "ATT-220", date: "Nov 05, 2026", grade: "All grades", present: 1191, absent: 72, late: 21, rate: "92.8%" },
  { id: "ATT-219", date: "Nov 04, 2026", grade: "All grades", present: 1212, absent: 49, late: 23, rate: "94.4%" },
  { id: "ATT-218", date: "Nov 03, 2026", grade: "All grades", present: 1189, absent: 68, late: 27, rate: "92.6%" },
];

const reports: AcademicReport[] = [
  { id: "RPT-41", title: "Term 1 academic performance", category: "Academics", updatedAt: "Nov 06, 2026", owner: "Avery Johnson" },
  { id: "RPT-40", title: "Weekly attendance summary", category: "Attendance", updatedAt: "Nov 05, 2026", owner: "Mia Robinson" },
  { id: "RPT-39", title: "Student enrollment overview", category: "Enrollment", updatedAt: "Nov 04, 2026", owner: "Jordan Davis" },
  { id: "RPT-38", title: "Grade 8 progress report", category: "Academics", updatedAt: "Nov 03, 2026", owner: "Lucas Clark" },
];

const pendingApprovals = [
  { id: "APP-1098", studentName: "Isabella Carter", grade: "Grade 6", submittedAt: "Today, 9:42 AM", status: "Pending review" as const },
  { id: "APP-1097", studentName: "Mason Taylor", grade: "Grade 8", submittedAt: "Today, 8:16 AM", status: "Needs information" as const },
  { id: "APP-1096", studentName: "Charlotte Moore", grade: "Grade 7", submittedAt: "Yesterday", status: "Pending review" as const },
];

const events = [
  { id: "EV-01", title: "Parent–teacher conferences", date: "Nov 10", time: "09:00 AM", type: "Meeting" as const },
  { id: "EV-02", title: "Midterm assessments begin", date: "Nov 12", time: "All day", type: "Academic" as const },
  { id: "EV-03", title: "Community open house", date: "Nov 16", time: "04:30 PM", type: "School" as const },
];

const fees: FeeRecord[] = [
  { id: "FEE-2401", studentName: "Olivia Bennett", studentNumber: "ST-1042", grade: "Grade 8", invoiceNumber: "INV-2026-1042", amount: 1250, dueDate: "Nov 10, 2026", status: "Pending" },
  { id: "FEE-2398", studentName: "Noah Williams", studentNumber: "ST-1038", grade: "Grade 7", invoiceNumber: "INV-2026-1038", amount: 980, dueDate: "Nov 08, 2026", status: "Paid" },
  { id: "FEE-2392", studentName: "Ava Thompson", studentNumber: "ST-1032", grade: "Grade 9", invoiceNumber: "INV-2026-1032", amount: 1425, dueDate: "Nov 01, 2026", status: "Overdue" },
  { id: "FEE-2387", studentName: "Liam Anderson", studentNumber: "ST-1026", grade: "Grade 6", invoiceNumber: "INV-2026-1026", amount: 1120, dueDate: "Nov 12, 2026", status: "Pending" },
  { id: "FEE-2381", studentName: "Sophia Martinez", studentNumber: "ST-1019", grade: "Grade 8", invoiceNumber: "INV-2026-1019", amount: 1250, dueDate: "Oct 28, 2026", status: "Paid" },
];

const assignments: Assignment[] = [
  { id: "ASM-031", title: "Linear equations practice", subject: "Mathematics", className: "Grade 8 · Section A", dueDate: "Nov 08, 2026", submissions: "24 / 28", status: "Due soon" },
  { id: "ASM-030", title: "Ecosystems field notes", subject: "Science", className: "Grade 7 · Section B", dueDate: "Nov 10, 2026", submissions: "18 / 26", status: "Published" },
  { id: "ASM-029", title: "Reading reflection: Chapter 5", subject: "English", className: "Grade 8 · Section A", dueDate: "Nov 12, 2026", submissions: "—", status: "Draft" },
  { id: "ASM-028", title: "Fractions and ratios", subject: "Mathematics", className: "Grade 6 · Section C", dueDate: "Nov 14, 2026", submissions: "25 / 25", status: "Published" },
];

const portalOverviews: Record<PortalRole, PortalOverview> = {
  teacher: {
    role: "teacher",
    greeting: "Your teaching day",
    schoolName: "Northstar Academy",
    metrics: [
      { label: "Classes today", value: "5", change: "Next class at 10:15", positive: true, icon: "book", tone: "blue" },
      { label: "Students", value: "126", change: "Across 5 classes", positive: true, icon: "users", tone: "violet" },
      { label: "To grade", value: "18", change: "6 due today", positive: false, icon: "clipboard", tone: "orange" },
      { label: "Attendance", value: "96.8%", change: "This week", positive: true, icon: "calendarCheck", tone: "green" },
    ],
    primaryTitle: "Today’s schedule",
    primaryDescription: "Your upcoming classes and teaching sessions.",
    primaryItems: [
      { id: "period-1", title: "Grade 8 · Mathematics", description: "Room 204 · Linear equations", meta: "09:00 – 09:50", status: "Completed" },
      { id: "period-2", title: "Grade 7 · Science", description: "Lab 2 · Ecosystems", meta: "10:15 – 11:05", status: "Next class" },
      { id: "period-3", title: "Grade 8 · Mathematics", description: "Room 204 · Practice review", meta: "11:30 – 12:20", status: "Upcoming" },
    ],
    secondaryTitle: "Needs your attention",
    secondaryItems: [
      { id: "grade-1", title: "Grade assignments", description: "18 submissions are waiting for review.", meta: "Due today", status: "Pending" },
      { id: "attendance-1", title: "Complete attendance", description: "One class register is still incomplete.", meta: "Grade 7 · Section B", status: "Action needed" },
    ],
  },
  accountant: {
    role: "accountant",
    greeting: "Finance overview",
    schoolName: "Northstar Academy",
    metrics: [
      { label: "Collected this month", value: "$84,250", change: "12.4%", positive: true, icon: "wallet", tone: "green" },
      { label: "Outstanding fees", value: "$12,840", change: "32 invoices", positive: false, icon: "clock", tone: "orange" },
      { label: "Paid invoices", value: "418", change: "This academic year", positive: true, icon: "check", tone: "blue" },
      { label: "Pending review", value: "7", change: "Receipts to reconcile", positive: false, icon: "receipt", tone: "violet" },
    ],
    primaryTitle: "Recent fee activity",
    primaryDescription: "Latest payments and invoices from your school.",
    primaryItems: fees.slice(0, 3).map((fee) => ({
      id: fee.id,
      title: `${fee.studentName} · ${fee.invoiceNumber}`,
      description: `${fee.grade} · $${fee.amount.toLocaleString()}`,
      meta: fee.dueDate,
      status: fee.status,
    })),
    secondaryTitle: "Finance tasks",
    secondaryItems: [
      { id: "task-1", title: "Reconcile payment receipts", description: "7 receipts are waiting to be matched.", meta: "Today", status: "Pending" },
      { id: "task-2", title: "Follow up on overdue fees", description: "32 families have an outstanding balance.", meta: "This week", status: "Action needed" },
    ],
  },
  parent: {
    role: "parent",
    greeting: "Olivia’s school day",
    schoolName: "Northstar Academy",
    metrics: [
      { label: "Attendance", value: "96%", change: "This term", positive: true, icon: "calendarCheck", tone: "green" },
      { label: "Average grade", value: "A−", change: "Across 6 subjects", positive: true, icon: "sparkles", tone: "violet" },
      { label: "Fee balance", value: "$1,250", change: "Due Nov 10", positive: false, icon: "wallet", tone: "orange" },
      { label: "Assignments", value: "2", change: "Due this week", positive: false, icon: "file", tone: "blue" },
    ],
    primaryTitle: "This week at school",
    primaryDescription: "A quick view of your child’s classes and upcoming work.",
    primaryItems: [
      { id: "parent-1", title: "Linear equations practice", description: "Mathematics · Ms. Robinson", meta: "Due Nov 08", status: "Due soon" },
      { id: "parent-2", title: "Ecosystems field notes", description: "Science · Mr. Clark", meta: "Due Nov 10", status: "Assigned" },
      { id: "parent-3", title: "Parent–teacher conference", description: "School conference room", meta: "Nov 10 · 9:00 AM", status: "Upcoming" },
    ],
    secondaryTitle: "Recent updates",
    secondaryItems: [
      { id: "update-1", title: "Attendance recorded", description: "Olivia arrived at school on time.", meta: "Today · 8:18 AM", status: "Present" },
      { id: "update-2", title: "Science project graded", description: "A strong result on the latest assignment.", meta: "Yesterday", status: "A−" },
    ],
  },
  student: {
    role: "student",
    greeting: "Your learning dashboard",
    schoolName: "Northstar Academy",
    metrics: [
      { label: "Classes today", value: "5", change: "Next: Mathematics", positive: true, icon: "book", tone: "blue" },
      { label: "Assignments due", value: "2", change: "One due tomorrow", positive: false, icon: "file", tone: "orange" },
      { label: "Current average", value: "A−", change: "Across 6 subjects", positive: true, icon: "sparkles", tone: "violet" },
      { label: "Attendance", value: "96%", change: "This term", positive: true, icon: "calendarCheck", tone: "green" },
    ],
    primaryTitle: "Your timetable",
    primaryDescription: "Today · Thursday, November 6",
    primaryItems: [
      { id: "student-1", title: "Mathematics", description: "Room 204 · Ms. Robinson", meta: "09:00 – 09:50", status: "Completed" },
      { id: "student-2", title: "Science", description: "Lab 2 · Mr. Clark", meta: "10:15 – 11:05", status: "Next class" },
      { id: "student-3", title: "English", description: "Room 112 · Ms. Parker", meta: "11:30 – 12:20", status: "Upcoming" },
    ],
    secondaryTitle: "Assignments to finish",
    secondaryItems: [
      { id: "work-1", title: "Linear equations practice", description: "Mathematics · 8 questions remaining", meta: "Due Nov 08", status: "Due soon" },
      { id: "work-2", title: "Ecosystems field notes", description: "Science · Add your observations", meta: "Due Nov 10", status: "Assigned" },
    ],
  },
};

let schoolSettings: SchoolSettingsData = {
  schoolName: "Northstar Academy",
  email: "hello@northstar.edu",
  schoolType: "private",
  academicYear: "2026-27",
  enrollmentNotifications: true,
  attendanceNotifications: true,
};

const metricsByRole: Record<SchoolRole, SchoolOverview["metrics"]> = {
  super_admin: [
    { label: "Total schools", value: "18", change: "2 new this term", positive: true, icon: "building", tone: "violet" },
    { label: "Total students", value: "12,846", change: "8.4%", positive: true, icon: "users", tone: "blue" },
    { label: "Teaching staff", value: "1,024", change: "4.2%", positive: true, icon: "user", tone: "green" },
    { label: "Average attendance", value: "93.7%", change: "1.2%", positive: true, icon: "calendarCheck", tone: "orange" },
  ],
  school_admin: [
    { label: "Total students", value: "1,284", change: "6.8%", positive: true, icon: "users", tone: "blue" },
    { label: "Teachers", value: "64", change: "3 new this term", positive: true, icon: "user", tone: "violet" },
    { label: "Attendance today", value: "93.7%", change: "1.2%", positive: true, icon: "calendarCheck", tone: "green" },
    { label: "Pending approvals", value: "23", change: "5 need review", positive: false, icon: "clock", tone: "orange" },
  ],
  principal: [
    { label: "My students", value: "1,284", change: "6.8%", positive: true, icon: "users", tone: "blue" },
    { label: "Classrooms", value: "42", change: "2 new this term", positive: true, icon: "book", tone: "violet" },
    { label: "Attendance today", value: "93.7%", change: "1.2%", positive: true, icon: "calendarCheck", tone: "green" },
    { label: "Students to review", value: "8", change: "2 urgent", positive: false, icon: "clock", tone: "orange" },
  ],
};

export class MockSchoolService implements SchoolService {
  async getOverview(role: SchoolRole, signal?: AbortSignal): Promise<SchoolOverview> {
    await delay(signal);
    return {
      role,
      schoolName: role === "super_admin" ? "All schools" : "Northstar Academy",
      metrics: metricsByRole[role],
      enrollment: [
        { month: "Jun", students: 802 },
        { month: "Jul", students: 846 },
        { month: "Aug", students: 924 },
        { month: "Sep", students: 1008 },
        { month: "Oct", students: 1142 },
        { month: "Nov", students: 1284 },
      ],
      pendingApprovals,
      upcomingEvents: events,
    };
  }

  async getPortalOverview(role: PortalRole, signal?: AbortSignal): Promise<PortalOverview> {
    await delay(signal);
    return portalOverviews[role];
  }

  async getStudents(signal?: AbortSignal): Promise<Student[]> {
    await delay(signal);
    return students.map((student) => ({ ...student }));
  }

  async createStudent(input: StudentInput): Promise<Student> {
    await delay();
    const duplicate = students.some(
      (student) => student.studentNumber.toLowerCase() === input.studentNumber.trim().toLowerCase(),
    );
    if (duplicate) throw new Error("A student with this ID already exists.");
    if (!input.name.trim() || !input.studentNumber.trim() || !input.grade.trim() || !input.guardian.trim()) {
      throw new Error("Complete all student details before saving.");
    }
    const nextNumber = Math.max(
      1042,
      ...students.map((student) => Number(student.studentNumber.replace(/\D/g, ""))),
    ) + 1;
    const student: Student = {
      id: `stu-${nextNumber}`,
      ...input,
      attendance: "—",
      status: "Pending",
    };
    students.unshift(student);
    return { ...student };
  }

  async updateStudent(id: string, input: StudentInput): Promise<Student> {
    await delay();
    const index = students.findIndex((student) => student.id === id);
    if (index < 0) throw new Error("This student could not be found.");
    const duplicate = students.some(
      (student, studentIndex) =>
        studentIndex !== index &&
        student.studentNumber.toLowerCase() === input.studentNumber.trim().toLowerCase(),
    );
    if (duplicate) throw new Error("A student with this ID already exists.");
    if (!input.name.trim() || !input.studentNumber.trim() || !input.grade.trim() || !input.guardian.trim()) {
      throw new Error("Complete all student details before saving.");
    }
    const updated: Student = { ...students[index], ...input };
    students[index] = updated;
    return { ...updated };
  }

  async getStaff(signal?: AbortSignal): Promise<StaffMember[]> {
    await delay(signal);
    return staff;
  }

  async getClassrooms(signal?: AbortSignal): Promise<Classroom[]> {
    await delay(signal);
    return classrooms;
  }

  async getSchools(signal?: AbortSignal): Promise<School[]> {
    await delay(signal);
    return schools;
  }

  async getAttendance(signal?: AbortSignal): Promise<AttendanceRecord[]> {
    await delay(signal);
    return attendance;
  }

  async getReports(signal?: AbortSignal): Promise<AcademicReport[]> {
    await delay(signal);
    return reports;
  }

  async getFees(signal?: AbortSignal): Promise<FeeRecord[]> {
    await delay(signal);
    return fees;
  }

  async getAssignments(signal?: AbortSignal): Promise<Assignment[]> {
    await delay(signal);
    return assignments;
  }

  async getSettings(signal?: AbortSignal): Promise<SchoolSettingsData> {
    await delay(signal);
    return { ...schoolSettings };
  }

  async updateSettings(settings: SchoolSettingsData): Promise<SchoolSettingsData> {
    await delay();
    schoolSettings = { ...settings };
    return { ...schoolSettings };
  }
}
