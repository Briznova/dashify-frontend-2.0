import { ApiClient } from "@/services/api-client";
import type { AuthService } from "@/services/auth-service";
import type { SchoolService } from "@/services/school-service";
import { HttpAuthService } from "@/services/http/http-auth-service";
import { HttpSchoolService } from "@/services/http/http-school-service";
import { MockAuthService } from "@/services/mock/mock-auth-service";
import { MockSchoolService } from "@/services/mock/mock-school-service";

const apiMode = process.env.NEXT_PUBLIC_DASHIFY_API_MODE === "api";
const apiClient = new ApiClient(process.env.NEXT_PUBLIC_DASHIFY_API_BASE_URL ?? "");

export const authService: AuthService = apiMode
  ? new HttpAuthService(apiClient)
  : new MockAuthService();

export const schoolService: SchoolService = apiMode
  ? new HttpSchoolService(apiClient)
  : new MockSchoolService();
