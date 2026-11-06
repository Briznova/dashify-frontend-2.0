import type {
  AuthSession,
  PasswordResetInput,
  SignInInput,
  SignUpInput,
} from "@/types/auth";

export interface AuthService {
  getSession(): Promise<AuthSession | null>;
  signIn(input: SignInInput): Promise<AuthSession>;
  signUp(input: SignUpInput): Promise<AuthSession>;
  requestPasswordReset(email: string): Promise<{ previewToken?: string } | void>;
  resetPassword(input: PasswordResetInput): Promise<void>;
  signOut(): Promise<void>;
}
