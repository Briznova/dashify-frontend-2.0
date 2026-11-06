import type { ReactNode } from "react";
import styles from "./page-heading.module.css";

type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: PageHeadingProps) {
  return (
    <header className={styles.pageHeading}>
      <div>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}
