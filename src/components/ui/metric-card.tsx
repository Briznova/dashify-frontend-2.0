import styles from "./metric-card.module.css";
import { Icon, type IconName } from "./icon";

export type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: "blue" | "violet" | "green" | "orange";
  change?: string;
  trend?: "positive" | "negative";
};

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone,
  change,
  trend,
}: MetricCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span>{label}</span>
        <span className={`${styles.icon} ${styles[tone]}`} aria-hidden="true">
          <Icon name={icon} size={17} />
        </span>
      </div>
      <strong className={styles.value}>{value}</strong>
      <div className={styles.foot}>
        {change && (
          <span className={trend === "negative" ? styles.negative : styles.positive}>
            {trend === "negative" ? "•" : "↗"} {change}
          </span>
        )}
        <span>{detail}</span>
      </div>
    </article>
  );
}
