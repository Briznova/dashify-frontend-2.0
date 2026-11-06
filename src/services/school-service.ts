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

export interface SchoolService {
  getOverview(role: SchoolRole, signal?: AbortSignal): Promise<SchoolOverview>;
  getPortalOverview(role: PortalRole, signal?: AbortSignal): Promise<PortalOverview>;
  getStudents(signal?: AbortSignal): Promise<Student[]>;
  createStudent(input: StudentInput): Promise<Student>;
  updateStudent(id: string, input: StudentInput): Promise<Student>;
  getStaff(signal?: AbortSignal): Promise<StaffMember[]>;
  getClassrooms(signal?: AbortSignal): Promise<Classroom[]>;
  getSchools(signal?: AbortSignal): Promise<School[]>;
  getAttendance(signal?: AbortSignal): Promise<AttendanceRecord[]>;
  getReports(signal?: AbortSignal): Promise<AcademicReport[]>;
  getFees(signal?: AbortSignal): Promise<FeeRecord[]>;
  getAssignments(signal?: AbortSignal): Promise<Assignment[]>;
  getSettings(signal?: AbortSignal): Promise<SchoolSettingsData>;
  updateSettings(settings: SchoolSettingsData): Promise<SchoolSettingsData>;
}
