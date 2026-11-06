import type {
  AuthSession,
  AuthUser,
  PasswordResetInput,
  SignInInput,
  SignUpInput,
  UserRole,
} from "@/types/auth";
import type { AuthService } from "@/services/auth-service";

const SESSION_KEY = "dashify.mock.session";
const RESET_TOKEN_PREFIX = "dashify.mock.reset.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole }> = {
  "superadmin@school.edu": { name: "Dashify Admin", role: "super_admin" },
  "admin@school.edu": { name: "Jordan Davis", role: "school_admin" },
  "principal@school.edu": { name: "Avery Johnson", role: "principal" },
  "teacher@school.edu": { name: "Mia Robinson", role: "teacher" },
  "accountant@school.edu": { name: "Finance Team", role: "accountant" },
  "parent@school.edu": { name: "Morgan Bennett", role: "parent" },
  "student@school.edu": { name: "Olivia Bennett", role: "student" },
};

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
    }, 300);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function createSession(
  name: string,
  email: string,
  schoolName: string | null,
  rememberMe = true,
  role: UserRole = "school_admin",
): AuthSession {
  const user: AuthUser = {
    id: `mock-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name,
    email,
    role,
    schoolName,
  };

  const session: AuthSession = { user };

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
  otherStorage.removeItem(SESSION_KEY);
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null || !("user" in value)) return false;
  const user = value.user;
  return typeof user === "object" &&
    user !== null &&
    "id" in user && typeof user.id === "string" &&
    "name" in user && typeof user.name === "string" &&
    "email" in user && typeof user.email === "string" &&
    "role" in user &&
    (user.role === "super_admin" || user.role === "school_admin" || user.role === "principal" || user.role === "teacher" || user.role === "accountant" || user.role === "parent" || user.role === "student") &&
    "schoolName" in user &&
    (typeof user.schoolName === "string" || user.schoolName === null);
}

export class MockAuthService implements AuthService {
  async getSession(): Promise<AuthSession | null> {
    const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("The preview session is invalid. Sign out and sign in again.");
      }
      throw error;
    }

    if (!isAuthSession(value)) {
      throw new Error("The preview session is invalid. Sign out and sign in again.");
    }
    return value;
  }

  async signIn(input: SignInInput): Promise<AuthSession> {
    await delay();
    if (!EMAIL_PATTERN.test(input.email) || input.password.length < 8) {
      throw new Error("Enter a valid email address and a password of at least 8 characters.");
    }

    const email = input.email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS[email];
    const name = account?.name ?? email.split("@")[0].replace(/[._-]/g, " ");
    return createSession(
      account?.name ?? name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      email,
      "Northstar Academy",
      input.rememberMe,
      account?.role ?? "school_admin",
    );
  }

  async signUp(input: SignUpInput): Promise<AuthSession> {
    await delay();
    if (!input.name.trim() || !EMAIL_PATTERN.test(input.email) || !input.schoolName.trim()) {
      throw new Error("Complete all fields with a valid email address.");
    }
    if (input.password.length < 8) {
      throw new Error("Your password must be at least 8 characters.");
    }
    return createSession(input.name.trim(), input.email.trim(), input.schoolName.trim());
  }

  async requestPasswordReset(email: string): Promise<{ previewToken: string }> {
    await delay();
    if (!EMAIL_PATTERN.test(email)) {
      throw new Error("Enter a valid email address.");
    }
    const previewToken = window.crypto.randomUUID();
    window.localStorage.setItem(`${RESET_TOKEN_PREFIX}${email.toLowerCase()}`, previewToken);
    return { previewToken };
  }

  async resetPassword(input: PasswordResetInput): Promise<void> {
    await delay();
    const tokenKey = `${RESET_TOKEN_PREFIX}${input.email.toLowerCase()}`;
    if (!EMAIL_PATTERN.test(input.email) || input.password.length < 8 || !input.token) {
      throw new Error("Enter a valid email address and a password of at least 8 characters.");
    }
    if (window.localStorage.getItem(tokenKey) !== input.token) {
      throw new Error("This password reset link is invalid or has expired. Request a new link.");
    }
    window.localStorage.removeItem(tokenKey);
  }

  async signOut(): Promise<void> {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}
