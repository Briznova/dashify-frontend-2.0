"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./dashboard-shell.module.css";
import { useAuth, useAuthSession } from "@/hooks/use-auth";
import { getDashboardRoute } from "@/lib/dashboard-route";
import type { UserRole } from "@/types/auth";
import { Icon, type IconName } from "./ui/icon";

type NavigationItem = { label: string; href: string; icon: IconName };

const schoolNavigation = [
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
] satisfies NavigationItem[];

const navigationByRole: Record<UserRole, NavigationItem[]> = {
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

const portalRoutes: Partial<Record<UserRole, string>> = {
  teacher: "/dashboard/teacher",
  accountant: "/dashboard/accountant",
  parent: "/dashboard/parent",
  student: "/dashboard/student",
};

function isRouteAllowed(pathname: string, role: UserRole) {
  const isSchoolAdministrator =
    role === "super_admin" || role === "school_admin" || role === "principal";
  if (pathname === "/dashboard/settings") return isSchoolAdministrator;

  const normalizedPath = pathname === "/dashboard/customers"
    ? "/dashboard/students"
    : pathname === "/dashboard/projects"
      ? "/dashboard/classes"
      : pathname;
  const allowed = navigationByRole[role].some((item) =>
    normalizedPath === item.href ||
    (item.href !== "/dashboard" && normalizedPath.startsWith(`${item.href}/`)),
  );
  if (allowed) return true;
  return Object.values(portalRoutes).includes(pathname) && portalRoutes[role] === pathname;
}

function Logo() {
  return (
    <span className={styles.brand}>
      <span className={styles.logoMark} aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span>dashify</span>
    </span>
  );
}

function formatRole(role: UserRole) {
  return role
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

const notificationsByRole: Record<UserRole, { title: string; detail: string; href: string; action: string }[]> = {
  super_admin: [
    { title: "School setup needs attention", detail: "Summit Preparatory has onboarding steps to complete.", href: "/dashboard/schools", action: "Review school" },
    { title: "Network attendance improved", detail: "Average attendance is up 1.2% this term.", href: "/dashboard/analytics", action: "View analytics" },
  ],
  school_admin: [
    { title: "Attendance follow-up", detail: "Two students are below the 90% attendance target.", href: "/dashboard/attendance", action: "Review attendance" },
    { title: "Enrollment requests", detail: "Three student applications are waiting for review.", href: "/dashboard/students", action: "Review requests" },
    { title: "Fee collection", detail: "Open invoices need follow-up this week.", href: "/dashboard/fees", action: "View fees" },
  ],
  principal: [
    { title: "Attendance watch", detail: "Review this week’s school attendance trend.", href: "/dashboard/attendance", action: "View attendance" },
    { title: "Academic reports", detail: "Term performance reports are ready to review.", href: "/dashboard/analytics", action: "Open reports" },
  ],
  teacher: [
    { title: "Assignments to grade", detail: "18 submissions are waiting for review.", href: "/dashboard/academics", action: "Review work" },
    { title: "Class register incomplete", detail: "Grade 7 · Section B attendance is not complete.", href: "/dashboard/attendance", action: "Complete register" },
  ],
  accountant: [
    { title: "Receipts to reconcile", detail: "Seven payment receipts need to be matched.", href: "/dashboard/fees", action: "Reconcile receipts" },
    { title: "Overdue balances", detail: "Some family invoices need follow-up.", href: "/dashboard/fees", action: "Review balances" },
  ],
  parent: [
    { title: "Assignment due soon", detail: "Linear equations practice is due Nov 08.", href: "/dashboard/parent", action: "View child updates" },
    { title: "School update", detail: "A parent–teacher conference is coming up.", href: "/dashboard/parent", action: "View school updates" },
  ],
  student: [
    { title: "Assignment due soon", detail: "Linear equations practice is due Nov 08.", href: "/dashboard/student", action: "View assignments" },
    { title: "Next class", detail: "Science begins at 10:15 in Lab 2.", href: "/dashboard/student", action: "View timetable" },
  ],
};

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const { signOut, isPending } = useAuth();
  const { session, isLoading: isSessionLoading, error: sessionError, refresh } = useAuthSession();
  const navigation = session ? navigationByRole[session.user.role] : [];
  const breadcrumbLabel = pathname === "/dashboard/settings"
      ? "Settings"
      : pathname === "/dashboard/customers"
      ? "Students"
      : pathname === "/dashboard/projects"
        ? "Classes"
        : navigation.find(
            (item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)),
          )?.label ?? "Overview";

  useEffect(() => {
    if (!isSessionLoading && !session && !sessionError) {
      router.replace("/auth/sign-in");
    } else if (session && !isRouteAllowed(pathname, session.user.role)) {
      router.replace(getDashboardRoute(session.user.role));
    }
  }, [isSessionLoading, pathname, router, session, sessionError]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  async function handleSignOut() {
    const succeeded = await signOut();
    if (succeeded) router.push("/auth/sign-in");
  }

  if (isSessionLoading) {
    return <main className={styles.sessionState} role="status">Checking your school session…</main>;
  }

  if (sessionError) {
    return <main className={styles.sessionState}><p role="alert">{sessionError}</p><button type="button" onClick={refresh}>Try again</button></main>;
  }

  if (!session) {
    return <main className={styles.sessionState} role="status">Redirecting to sign in…</main>;
  }

  if (!isRouteAllowed(pathname, session.user.role)) {
    return <main className={styles.sessionState} role="status">Opening your role workspace…</main>;
  }

  const user = session.user;
  const roleNotifications = notificationsByRole[user.role];
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.app}>
      {sidebarOpen && <button className={styles.backdrop} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <Link href="/" className={styles.logoLink} aria-label="Dashify home"><Logo /></Link>
        <div className={styles.workspace}>
          <span className={styles.workspaceIcon}>{(user.schoolName ?? "S").slice(0, 1)}</span>
          <span className={styles.workspaceText}><strong>{user.schoolName ?? "All schools"}</strong><small>{user.role.replaceAll("_", " ")}</small></span>
          <span className={styles.workspaceChevron}><Icon name="chevronDown" size={16} /></span>
        </div>
        <div className={styles.navLabel}>WORKSPACE</div>
        <nav className={styles.navigation} aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  setSidebarOpen(false);
                  setNotificationsOpen(false);
                }}
              >
                <span className={styles.navIcon}><Icon name={item.icon} size={18} /></span>
                <span>{item.label}</span>
                {item.label === "Students" && <span className={styles.navCount}>23</span>}
              </Link>
            );
          })}
        </nav>
        {(user.role === "school_admin" || user.role === "principal" || user.role === "super_admin") && (
          <>
            <div className={styles.navLabel}>PREFERENCES</div>
            <Link className={`${styles.navLink} ${pathname === "/dashboard/settings" ? styles.navLinkActive : ""}`} href="/dashboard/settings" aria-current={pathname === "/dashboard/settings" ? "page" : undefined} onClick={() => {
              setSidebarOpen(false);
              setProfileOpen(false);
            }}>
              <span className={styles.navIcon}><Icon name="settings" size={18} /></span><span>Settings</span>
            </Link>
          </>
        )}
        <div className={styles.sidebarSpacer} />
        <div className={styles.helpCard}>
          <span className={styles.helpIcon}><Icon name="sparkles" size={17} /></span>
          <strong>Need a hand?</strong>
          <p>Visit our help center to get the most out of Dashify.</p>
          <a href="mailto:hello@dashify.app">Visit help center <Icon name="arrowUpRight" size={14} /></a>
        </div>
        <div className={styles.profileWrap}>
          <button className={styles.profileButton} aria-label={`Signed in as ${user.name}`} aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)}>
            <span className={styles.profileAvatar}>{initials}</span>
            <span className={styles.profileText}>
              <strong>{user.name}</strong>
              <small>{formatRole(user.role)}</small>
            </span>
            <span className={styles.profileMore} aria-hidden="true"><Icon name="chevronDown" size={16} /></span>
          </button>
          {profileOpen && (
            <div className={styles.profileMenu}>
              <div className={styles.profileDetails}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <small>{formatRole(user.role)}</small>
              </div>
              {(user.role === "school_admin" || user.role === "principal" || user.role === "super_admin") && <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)}>Workspace settings</Link>}
              <button type="button" onClick={handleSignOut} disabled={isPending}>{isPending ? "Signing out..." : "Sign out"}</button>
            </div>
          )}
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <button className={styles.mobileMenu} aria-label="Open navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}><Icon name="menu" size={19} /></button>
          <div className={styles.breadcrumb}><span>{user.role === "super_admin" ? "Dashify" : user.schoolName ?? "School workspace"}</span><span aria-hidden="true">/</span><strong>{breadcrumbLabel}</strong></div>
          <div className={styles.topbarActions}>
            <div className={styles.notificationWrap}>
              <button className={styles.iconButton} aria-label="Notifications" aria-expanded={notificationsOpen} aria-controls="dashboard-notifications" onClick={() => {
                setNotificationsOpen(!notificationsOpen);
              }}>
                <Icon name="bell" size={19} />
                {!notificationsRead && <i />}
              </button>
              {notificationsOpen && (
                <div className={styles.notificationPanel} id="dashboard-notifications" role="region" aria-label="Notifications">
                  <div className={styles.notificationHeader}>
                    <div><strong>Notifications</strong><span>{notificationsRead ? "You’re all caught up" : `${roleNotifications.length} updates for you`}</span></div>
                    {!notificationsRead && <button type="button" onClick={() => setNotificationsRead(true)}>Mark all read</button>}
                  </div>
                  {!notificationsRead ? roleNotifications.map((notification) => (
                    <Link
                      className={styles.notificationItem}
                      href={notification.href}
                      key={notification.title}
                      onClick={() => {
                        setNotificationsOpen(false);
                        setNotificationsRead(true);
                      }}
                    >
                      <span className={styles.notificationDot} aria-hidden="true" />
                      <span><strong>{notification.title}</strong><small>{notification.detail}</small><em>{notification.action} <Icon name="arrowUpRight" size={13} /></em></span>
                    </Link>
                  )) : <p className={styles.notificationsEmpty}>You’re up to date. New activity for your role will appear here.</p>}
                </div>
              )}
            </div>
            <button className={styles.topAvatar} aria-label={`Open ${user.name} profile`} aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)}>{initials}</button>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

export function DashboardShellFallback() {
  return <main className={styles.sessionState} role="status">Loading school workspace…</main>;
}
