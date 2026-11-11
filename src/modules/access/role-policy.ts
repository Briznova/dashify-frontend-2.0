import type { Capability } from "./capabilities";
import type { NavigationItem } from "./navigation";
import { getRoleNavigation } from "./navigation";
import type { UserRole } from "./roles";

export type RolePolicy = {
  role: UserRole;
  homePath: string;
  scope: "platform" | "school";
  capabilities: readonly Capability[];
  navigation: readonly NavigationItem[];
};

const baseSchoolCapabilities = [
  "schools.read",
  "students.read",
  "students.manage",
  "attendance.read",
  "attendance.manage",
  "academics.read",
  "assignments.manage",
  "finance.read",
  "reports.read",
  "settings.manage",
] as const satisfies readonly Capability[];

const rolePolicies: Record<UserRole, RolePolicy> = {
  super_admin: {
    role: "super_admin",
    homePath: "/dashboard",
    scope: "platform",
    capabilities: [
      "platform.overview",
      "schools.read",
      "schools.manage",
      ...baseSchoolCapabilities,
    ],
    navigation: getRoleNavigation("super_admin"),
  },
  school_admin: {
    role: "school_admin",
    homePath: "/dashboard",
    scope: "school",
    capabilities: [
      "platform.overview",
      "students.read",
      "students.manage",
      "attendance.read",
      "attendance.manage",
      "academics.read",
      "assignments.manage",
      "finance.read",
      "reports.read",
      "settings.manage",
    ],
    navigation: getRoleNavigation("school_admin"),
  },
  principal: {
    role: "principal",
    homePath: "/dashboard",
    scope: "school",
    capabilities: [
      "students.read",
      "attendance.read",
      "attendance.manage",
      "academics.read",
      "reports.read",
      "settings.manage",
    ],
    navigation: getRoleNavigation("principal"),
  },
  teacher: {
    role: "teacher",
    homePath: "/dashboard/teacher",
    scope: "school",
    capabilities: [
      "students.read",
      "attendance.read",
      "attendance.manage",
      "academics.read",
      "assignments.manage",
      "reports.read",
    ],
    navigation: getRoleNavigation("teacher"),
  },
  accountant: {
    role: "accountant",
    homePath: "/dashboard/accountant",
    scope: "school",
    capabilities: [
      "finance.read",
      "reports.read",
      "students.read",
    ],
    navigation: getRoleNavigation("accountant"),
  },
  parent: {
    role: "parent",
    homePath: "/dashboard/parent",
    scope: "school",
    capabilities: [
      "students.read",
      "attendance.read",
      "academics.read",
      "reports.read",
    ],
    navigation: getRoleNavigation("parent"),
  },
  student: {
    role: "student",
    homePath: "/dashboard/student",
    scope: "school",
    capabilities: [
      "students.read",
      "attendance.read",
      "academics.read",
      "reports.read",
    ],
    navigation: getRoleNavigation("student"),
  },
};

export function getRolePolicy(role: UserRole): RolePolicy {
  return rolePolicies[role];
}

export function getRoleHomePath(role: UserRole): string {
  return getRolePolicy(role).homePath;
}

export function getRoleCapabilities(role: UserRole): readonly Capability[] {
  return getRolePolicy(role).capabilities;
}
