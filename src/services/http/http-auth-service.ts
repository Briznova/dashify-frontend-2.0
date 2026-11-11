import type {
  AuthSession,
  SignInInput,
  UserRole,
} from "@/types/auth";
import type { ApiClient } from "@/services/api-client";
import { ApiError } from "@/services/api-client";
import type { AuthService } from "@/services/auth-service";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "@/services/auth-token";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
  };
};

type SchoolMembership = {
  membershipId: string;
  school: {
    id: string;
    name: string;
  };
};

type ActiveSchoolResponse = {
  accessToken: string;
  role: string;
  schoolName: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
  };
};

type CurrentUserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  schoolName: string;
};

const roleByBackendKey: Record<string, UserRole> = {
  SUPER_ADMIN: "super_admin",
  SCHOOL_ADMIN: "school_admin",
  PRINCIPAL: "principal",
  TEACHER: "teacher",
  ACCOUNTANT: "accountant",
  PARENT: "parent",
  STUDENT: "student",
  super_admin: "super_admin",
  school_admin: "school_admin",
  principal: "principal",
  teacher: "teacher",
  accountant: "accountant",
  parent: "parent",
  student: "student",
};

function toAuthSession(user: CurrentUserResponse | ActiveSchoolResponse["user"] & {
  role: string;
  schoolName: string;
}): AuthSession {
  const role = roleByBackendKey[user.role];
  if (!role) {
    throw new Error(`The backend returned an unsupported role: ${user.role}`);
  }
  return {
    user: {
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      email: user.email,
      role,
      schoolName: user.schoolName,
    },
  };
}

export class HttpAuthService implements AuthService {
  constructor(private readonly api: ApiClient) {}

  async getSession(): Promise<AuthSession | null> {
    if (!getAccessToken()) return null;
    try {
      const user = await this.api.request<CurrentUserResponse>("/auth/me");
      return toAuthSession(user);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearAuthTokens();
        return null;
      }
      throw error;
    }
  }

  async signIn(input: SignInInput): Promise<AuthSession> {
    clearAuthTokens();
    const login = await this.api.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: input.email, password: input.password }),
    });
    saveAuthTokens({
      accessToken: login.accessToken,
      refreshToken: login.refreshToken,
      rememberMe: input.rememberMe,
    });

    try {
      const schools = await this.api.request<SchoolMembership[]>("/auth/schools");
      const membership = schools[0];
      if (!membership) {
        throw new Error("This account does not have an active school membership.");
      }

      const activeSchool = await this.api.request<ActiveSchoolResponse>("/auth/active-school", {
        method: "POST",
        body: JSON.stringify({ schoolId: membership.school.id }),
      });
      saveAuthTokens({
        accessToken: activeSchool.accessToken,
        refreshToken: login.refreshToken,
        rememberMe: input.rememberMe,
      });
      return toAuthSession({
        ...activeSchool.user,
        role: activeSchool.role,
        schoolName: activeSchool.schoolName,
      });
    } catch (error) {
      clearAuthTokens();
      throw error;
    }
  }

  async signUp(): Promise<AuthSession> {
    throw new ApiError("Account sign-up is not implemented by the backend yet.", 501);
  }

  async requestPasswordReset(): Promise<{ previewToken?: string }> {
    throw new ApiError("Password reset is not implemented by the backend yet.", 501);
  }

  async resetPassword(): Promise<void> {
    throw new ApiError("Password reset is not implemented by the backend yet.", 501);
  }

  async signOut(): Promise<void> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      return;
    }
    await this.api.request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    clearAuthTokens();
  }
}
