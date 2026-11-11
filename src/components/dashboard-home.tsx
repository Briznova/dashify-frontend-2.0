"use client";

import { useAuthSession } from "@/hooks/use-auth";
import type { UserRole } from "@/modules/access";
import { SuperAdminWorkspace } from "@/modules/workspace/super-admin/workspace";
import { SchoolAdminWorkspace } from "@/modules/workspace/school-admin/workspace";
import { PrincipalWorkspace } from "@/modules/workspace/principal/workspace";
import { TeacherWorkspace } from "@/modules/workspace/teacher/workspace";
import { AccountantWorkspace } from "@/modules/workspace/accountant/workspace";
import { ParentWorkspace } from "@/modules/workspace/parent/workspace";
import { StudentWorkspace } from "@/modules/workspace/student/workspace";
import styles from "./dashboard-shell.module.css";

export function DashboardHome() {
  const { session, isLoading, error } = useAuthSession();

  if (isLoading) {
    return <p className={styles.sessionState} role="status">Loading your role workspace…</p>;
  }
  if (error) {
    return <p className={styles.sessionState} role="alert">{error}</p>;
  }
  if (!session) return null;

  const role: UserRole = session.user.role;

  switch (role) {
    case "super_admin":
      return <SuperAdminWorkspace userName={session.user.name} />;
    case "school_admin":
      return <SchoolAdminWorkspace userName={session.user.name} />;
    case "principal":
      return <PrincipalWorkspace userName={session.user.name} />;
    case "teacher":
      return <TeacherWorkspace />;
    case "accountant":
      return <AccountantWorkspace />;
    case "parent":
      return <ParentWorkspace />;
    case "student":
      return <StudentWorkspace />;
  }
}
