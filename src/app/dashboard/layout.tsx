import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { DashboardShell, DashboardShellFallback } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense fallback={<DashboardShellFallback />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
