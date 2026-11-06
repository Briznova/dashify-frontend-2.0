"use client";

import {
  useAssignments,
  useFees,
  usePortalOverview,
} from "@/hooks/use-school-data";
import type {
  Assignment,
  FeeRecord,
  PortalAction,
  PortalRole,
} from "@/types/school";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeading } from "@/components/ui/page-heading";
import { Panel } from "@/components/ui/panel";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import styles from "./school-extras.module.css";

const portalDescriptions: Record<PortalRole, string> = {
  teacher: "A focused view of your schedule, class registers, and student work.",
  accountant: "Track fee collection, reconcile payments, and follow up on balances.",
  parent: "Stay connected to your child’s classes, progress, and school updates.",
  student: "See what’s next in your day and keep your learning on track.",
};

function ActionList({ items }: { items: PortalAction[] }) {
  return (
    <div className={styles.actionList}>
      {items.map((item) => (
        <article className={styles.actionItem} key={item.id}>
          <div className={styles.actionBody}>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <span>{item.meta}</span>
          </div>
          <StatusBadge>{item.status}</StatusBadge>
        </article>
      ))}
    </div>
  );
}

export function PortalDashboard({ role }: { role: PortalRole }) {
  const resource = usePortalOverview(role);
  const data = resource.data;

  return (
    <>
      <PageHeading
        eyebrow={`${data?.schoolName ?? "NORTHSTAR ACADEMY"} · ${role.toUpperCase()} PORTAL`}
        title={data?.greeting ?? "Your school workspace"}
        description={portalDescriptions[role]}
      />
      <ResourceState
        error={resource.error}
        isLoading={resource.isLoading}
        onRetry={resource.refresh}
      />
      {data && (
        <>
          <section className={styles.metrics} aria-label={`${role} summary`}>
            {data.metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                detail={metric.change}
                icon={metric.icon}
                tone={metric.tone}
                trend={metric.positive ? "positive" : "negative"}
              />
            ))}
          </section>
          <div className={styles.portalGrid}>
            <Panel title={data.primaryTitle} description={data.primaryDescription}>
              <ActionList items={data.primaryItems} />
            </Panel>
            <Panel title={data.secondaryTitle} description="Stay on top of important updates.">
              <ActionList items={data.secondaryItems} />
            </Panel>
          </div>
          <div className={styles.portalHint}>
            <span aria-hidden="true">✦</span>
            <p>
              <strong>One school, one shared workspace.</strong> Your portal keeps
              the information most useful to you together in one place.
            </p>
          </div>
        </>
      )}
    </>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FeesDirectory() {
  const resource = useFees();
  const fees = resource.data ?? [];
  const paidTotal = fees
    .filter((fee) => fee.status === "Paid")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const outstandingTotal = fees
    .filter((fee) => fee.status !== "Paid")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const columns: DataTableColumn<FeeRecord>[] = [
    {
      heading: "STUDENT",
      render: (row) => (
        <span className={styles.personCell}>
          <strong>{row.studentName}</strong>
          <small>{row.studentNumber} · {row.grade}</small>
        </span>
      ),
    },
    { heading: "INVOICE", render: (row) => row.invoiceNumber },
    { heading: "DUE DATE", render: (row) => row.dueDate },
    { heading: "AMOUNT", render: (row) => <strong className={styles.amount}>{formatCurrency(row.amount)}</strong> },
    { heading: "STATUS", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeading
        eyebrow="SCHOOL FINANCE"
        title="Fees & payments"
        description="Review fee collection, outstanding balances, and recent payments."
      />
      <ResourceState error={resource.error} isLoading={resource.isLoading} onRetry={resource.refresh} />
      {resource.data && (
        <>
          <section className={styles.metrics} aria-label="Fee collection summary">
            <MetricCard label="Collected" value={formatCurrency(paidTotal)} detail="Paid invoices in this view" icon="wallet" tone="green" />
            <MetricCard label="Outstanding" value={formatCurrency(outstandingTotal)} detail="Pending and overdue" icon="clock" tone="orange" />
            <MetricCard label="Paid invoices" value={String(fees.filter((fee) => fee.status === "Paid").length)} detail="Receipt available" icon="check" tone="blue" />
            <MetricCard label="Needs follow-up" value={String(fees.filter((fee) => fee.status === "Overdue").length)} detail="Overdue invoices" icon="alert" tone="violet" />
          </section>
          <DataTable
            title="Recent invoices"
            description="A clear view of family balances and payment status."
            rows={resource.data}
            columns={columns}
            isLoading={resource.isLoading}
            error={resource.error}
            onRetry={resource.refresh}
            searchText={(row) => `${row.studentName} ${row.studentNumber} ${row.grade} ${row.invoiceNumber} ${row.status}`}
          />
        </>
      )}
    </>
  );
}

export function AcademicsDirectory() {
  const resource = useAssignments();
  const assignments = resource.data ?? [];
  const columns: DataTableColumn<Assignment>[] = [
    {
      heading: "ASSIGNMENT",
      render: (row) => (
        <span className={styles.personCell}>
          <strong>{row.title}</strong>
          <small>{row.subject}</small>
        </span>
      ),
    },
    { heading: "CLASS", render: (row) => row.className },
    { heading: "DUE DATE", render: (row) => row.dueDate },
    { heading: "SUBMISSIONS", render: (row) => row.submissions },
    { heading: "STATUS", render: (row) => <StatusBadge>{row.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeading
        eyebrow="TEACHING & LEARNING"
        title="Academics & assignments"
        description="Publish classwork, track submissions, and celebrate student progress."
      />
      <ResourceState error={resource.error} isLoading={resource.isLoading} onRetry={resource.refresh} />
      {resource.data && (
        <>
          <section className={styles.metrics} aria-label="Academic activity summary">
            <MetricCard label="Assignments" value={String(assignments.length)} detail="Across active classes" icon="file" tone="blue" />
            <MetricCard label="Awaiting review" value="18" detail="Student submissions" icon="clock" tone="orange" />
            <MetricCard label="Published" value={String(assignments.filter((item) => item.status === "Published" || item.status === "Due soon").length)} detail="Visible to students" icon="check" tone="green" />
            <MetricCard label="Classes" value="3" detail="With active coursework" icon="book" tone="violet" />
          </section>
          <DataTable
            title="Class assignments"
            description="Manage due dates and see how students are progressing."
            rows={resource.data}
            columns={columns}
            isLoading={resource.isLoading}
            error={resource.error}
            onRetry={resource.refresh}
            searchText={(row) => `${row.title} ${row.subject} ${row.className} ${row.status}`}
          />
        </>
      )}
    </>
  );
}
