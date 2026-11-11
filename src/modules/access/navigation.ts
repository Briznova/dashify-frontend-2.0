import type { IconName } from "@/components/ui/icon";
import type { UserRole } from "./roles";

export type NavigationItem = {
  label: string;
  href: string;
  icon: IconName;
};

export const schoolNavigation = [
  { label: "Overview", href: "/dashboard", icon: "layoutDashboard" },
  { label: "Schools", href: "/dashboard/schools", icon: "building" },
  { label: "Students", href: "/dashboard/students", icon: "users" },
  { label: "Staff", href: "/dashboard/staff", icon: "user" },
  { label: "Classes", href: "/dashboard/classes", icon: "book" },
  { label: "Attendance", href: "/dashboard/attendance", icon: "calendarCheck" },
  { label: "Fees", href: "/dashboard/fees", icon: "wallet" },
  { label: "Academics", href: "/dashboard/academics", icon: "graduationCap" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "chart" },
  { label: "Reports", href: "/dashboard/reports", icon: "file" },
] as const satisfies readonly NavigationItem[];

export const portalRoutes: Partial<Record<UserRole, string>> = {
  teacher: "/dashboard/teacher",
  accountant: "/dashboard/accountant",
  parent: "/dashboard/parent",
  student: "/dashboard/student",
};

export function getRoleNavigation(role: UserRole): readonly NavigationItem[] {
  const navigationByRole: Record<UserRole, readonly NavigationItem[]> = {
    super_admin: schoolNavigation,
    school_admin: schoolNavigation.filter((item) => item.href !== "/dashboard/schools"),
    principal: schoolNavigation.filter((item) => item.href !== "/dashboard/schools"),
    teacher: [
      schoolNavigation[0],
      { label: "My teaching day", href: "/dashboard/teacher", icon: "user" },
      schoolNavigation[4],
      schoolNavigation[5],
      schoolNavigation[7],
    ],
    accountant: [
      schoolNavigation[0],
      { label: "Finance overview", href: "/dashboard/accountant", icon: "wallet" },
      schoolNavigation[6],
      schoolNavigation[9],
    ],
    parent: [
      schoolNavigation[0],
      { label: "My child", href: "/dashboard/parent", icon: "home" },
    ],
    student: [
      schoolNavigation[0],
      { label: "My learning", href: "/dashboard/student", icon: "graduationCap" },
      schoolNavigation[7],
    ],
  };

  return navigationByRole[role];
}
