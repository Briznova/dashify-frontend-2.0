export { type UserRole } from "@/types/auth";

export const USER_ROLES = [
  "super_admin",
  "school_admin",
  "principal",
  "teacher",
  "accountant",
  "parent",
  "student",
] as const;
