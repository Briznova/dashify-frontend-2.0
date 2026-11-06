import styles from "./resource-state.module.css";

type ResourceStateProps = {
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
};

export function ResourceState({
  error,
  isLoading,
  onRetry,
}: ResourceStateProps) {
  if (isLoading) {
    return (
      <div className={styles.loading} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        Loading school data…
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <span>{error}</span>
        <button type="button" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  return null;
}
