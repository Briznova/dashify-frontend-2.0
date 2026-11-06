import type { ApiClient } from "@/services/api-client";
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

export class HttpSchoolService implements SchoolService {
  constructor(private readonly api: ApiClient) {}

  getOverview(role: SchoolRole, signal?: AbortSignal): Promise<SchoolOverview> {
    return this.api.request(`/school/dashboard?role=${encodeURIComponent(role)}`, {}, signal);
  }

  getPortalOverview(role: PortalRole, signal?: AbortSignal): Promise<PortalOverview> {
    return this.api.request(`/school/portal-dashboard?role=${encodeURIComponent(role)}`, {}, signal);
  }

  getStudents(signal?: AbortSignal): Promise<Student[]> {
    return this.api.request("/school/students", {}, signal);
  }

  createStudent(input: StudentInput): Promise<Student> {
    return this.api.request("/school/students", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  updateStudent(id: string, input: StudentInput): Promise<Student> {
    return this.api.request(`/school/students/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  getStaff(signal?: AbortSignal): Promise<StaffMember[]> {
    return this.api.request("/school/staff", {}, signal);
  }

  getClassrooms(signal?: AbortSignal): Promise<Classroom[]> {
    return this.api.request("/school/classrooms", {}, signal);
  }

  getSchools(signal?: AbortSignal): Promise<School[]> {
    return this.api.request("/schools", {}, signal);
  }

  getAttendance(signal?: AbortSignal): Promise<AttendanceRecord[]> {
    return this.api.request("/school/attendance", {}, signal);
  }

  getReports(signal?: AbortSignal): Promise<AcademicReport[]> {
    return this.api.request("/school/reports", {}, signal);
  }

  getFees(signal?: AbortSignal): Promise<FeeRecord[]> {
    return this.api.request("/school/fees", {}, signal);
  }

  getAssignments(signal?: AbortSignal): Promise<Assignment[]> {
    return this.api.request("/school/assignments", {}, signal);
  }

  getSettings(signal?: AbortSignal): Promise<SchoolSettingsData> {
    return this.api.request("/school/settings", {}, signal);
  }

  updateSettings(settings: SchoolSettingsData): Promise<SchoolSettingsData> {
    return this.api.request("/school/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }
}
