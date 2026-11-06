import styles from "./status-badge.module.css";

export type StatusVariant = "success" | "warning" | "info" | "neutral" | "danger";

const statusVariants: Record<string, StatusVariant> = {
  Active: "success",
  "In session": "success",
  Paid: "success",
  Published: "success",
  Completed: "success",
  Present: "success",
  Pending: "warning",
  Upcoming: "warning",
  "Setup in progress": "warning",
  "Due soon": "warning",
  "Needs information": "warning",
  "Pending review": "warning",
  "Action needed": "warning",
  Overdue: "danger",
  Absent: "danger",
  Late: "warning",
  Draft: "neutral",
  "On leave": "neutral",
  "Next class": "info",
  Assigned: "info",
  "A−": "success",
};

type StatusBadgeProps = {
  children: string;
  variant?: StatusVariant;
};

export function StatusBadge({ children, variant }: StatusBadgeProps) {
  const resolvedVariant = variant ?? statusVariants[children] ?? "neutral";
  return (
    <span className={`${styles.badge} ${styles[resolvedVariant]}`}>
      {children}
    </span>
  );
}
