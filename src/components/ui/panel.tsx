import type { ReactNode } from "react";
import styles from "./panel.module.css";

type PanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  stackActionOnNarrow?: boolean;
  children: ReactNode;
  className?: string;
};

export function Panel({
  title,
  description,
  action,
  stackActionOnNarrow = false,
  children,
  className,
}: PanelProps) {
  return (
    <section className={`${styles.panel} ${className ?? ""}`}>
      <header className={`${styles.header} ${stackActionOnNarrow ? styles.headerStackOnNarrow : ""}`}>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
