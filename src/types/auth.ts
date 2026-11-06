export type UserRole =
  | "super_admin"
  | "school_admin"
  | "principal"
  | "teacher"
  | "accountant"
  | "parent"
  | "student";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolName: string | null;
};

export type AuthSession = {
  user: AuthUser;
};

export type SignInInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  schoolName: string;
};

export type PasswordResetInput = {
  token: string;
  email: string;
  password: string;
};
