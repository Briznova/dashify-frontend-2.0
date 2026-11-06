"use client";

import { PortalDashboard } from "@/components/school-extras";
import { SchoolDashboardView } from "@/components/school-dashboard";
import { useAuthSession } from "@/hooks/use-auth";
import type { SchoolRole } from "@/types/school";
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

  switch (session.user.role) {
    case "teacher":
    case "accountant":
    case "parent":
    case "student":
      return <PortalDashboard role={session.user.role} />;
    case "super_admin":
    case "school_admin":
    case "principal": {
      const role: SchoolRole = session.user.role;
      return <SchoolDashboardView role={role} userName={session.user.name} />;
    }
  }
}
