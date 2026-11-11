import type { ApiClient } from "@/services/api-client";
import { ApiError } from "@/services/api-client";
import type { SchoolService } from "@/services/school-service";
import type {
  AcademicReport,
  Assignment,
  AttendanceRecord,
  Classroom,
  FeeRecord,
  PortalOverview,
  School,
  SchoolOverview,
  SchoolSettingsData,
  StaffMember,
  Student,
} from "@/types/school";

export class HttpSchoolService implements SchoolService {
  constructor(private readonly api: ApiClient) {}

  async getOverview(): Promise<SchoolOverview> {
    throw new ApiError("Dashboard summaries are not implemented by the backend yet.", 501);
  }

  async getPortalOverview(): Promise<PortalOverview> {
    throw new ApiError("Role portal summaries are not implemented by the backend yet.", 501);
  }

  async getStudents(signal?: AbortSignal): Promise<Student[]> {
    type StudentPage = {
      data: {
        id: string;
        admissionNumber: string;
        firstName: string;
        middleName: string | null;
        lastName: string | null;
        status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
        guardians: { isPrimary: boolean; guardian: { firstName: string; lastName: string | null } }[];
        enrolments: {
          isActive: boolean;
          section: { name: string; class: { name: string } };
        }[];
      }[];
      meta: { page: number; totalPages: number };
    };

    const students: Student[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const result = await this.api.request<StudentPage>(
        `/students?page=${page}&pageSize=100`,
        {},
        signal,
      );
      students.push(...result.data.map((student): Student => {
        const enrolment = student.enrolments.find((entry) => entry.isActive)
          ?? student.enrolments[0];
        const guardian = student.guardians.find((entry) => entry.isPrimary)
          ?? student.guardians[0];
        return {
          id: student.id,
          name: [student.firstName, student.middleName, student.lastName].filter(Boolean).join(" "),
          studentNumber: student.admissionNumber,
          grade: enrolment
            ? `${enrolment.section.class.name} · ${enrolment.section.name}`
            : "Not enrolled",
          guardian: guardian
            ? [guardian.guardian.firstName, guardian.guardian.lastName].filter(Boolean).join(" ")
            : "—",
          attendance: "—",
          status: student.status === "INACTIVE" ? "On leave" : "Active",
        };
      }));
      totalPages = result.meta.totalPages;
      page += 1;
    } while (page <= totalPages);

    return students;
  }

  async createStudent(): Promise<Student> {
    throw new ApiError(
      "Student creation needs admission, academic year, class, section, and guardian details that this form does not collect yet.",
      501,
    );
  }

  async updateStudent(): Promise<Student> {
    throw new ApiError("Student profile updates are not implemented by the backend yet.", 501);
  }

  async getStaff(): Promise<StaffMember[]> {
    throw new ApiError("Staff directory endpoints are not implemented by the backend yet.", 501);
  }

  async getClassrooms(): Promise<Classroom[]> {
    throw new ApiError("The backend class API does not yet provide the classroom fields required by this view.", 501);
  }

  async getSchools(): Promise<School[]> {
    throw new ApiError("A school directory endpoint is not implemented by the backend yet.", 501);
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    throw new ApiError("Attendance summary endpoints are not implemented by the backend yet.", 501);
  }

  async getReports(): Promise<AcademicReport[]> {
    throw new ApiError("Reporting endpoints are not implemented by the backend yet.", 501);
  }

  async getFees(): Promise<FeeRecord[]> {
    throw new ApiError("Finance endpoints are not implemented by the backend yet.", 501);
  }

  async getAssignments(): Promise<Assignment[]> {
    throw new ApiError("Assignment endpoints are not implemented by the backend yet.", 501);
  }

  async getSettings(): Promise<SchoolSettingsData> {
    throw new ApiError("School settings fields are not yet aligned with the backend school profile.", 501);
  }

  async updateSettings(): Promise<SchoolSettingsData> {
    throw new ApiError("School settings fields are not yet aligned with the backend school profile.", 501);
  }
}
