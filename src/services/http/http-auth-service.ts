import type {
  AuthSession,
  PasswordResetInput,
  SignInInput,
  SignUpInput,
} from "@/types/auth";
import type { ApiClient } from "@/services/api-client";
import { ApiError } from "@/services/api-client";
import type { AuthService } from "@/services/auth-service";

export class HttpAuthService implements AuthService {
  constructor(private readonly api: ApiClient) {}

  async getSession(): Promise<AuthSession | null> {
    try {
      return await this.api.request("/auth/session");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  }

  signIn(input: SignInInput): Promise<AuthSession> {
    return this.api.request("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  signUp(input: SignUpInput): Promise<AuthSession> {
    return this.api.request("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async requestPasswordReset(email: string): Promise<{ previewToken?: string }> {
    const response = await this.api.request<{ previewToken?: string } | undefined>("/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response ?? {};
  }

  resetPassword(input: PasswordResetInput): Promise<void> {
    return this.api.request("/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  signOut(): Promise<void> {
    return this.api.request("/auth/sign-out", { method: "POST" });
  }
}
