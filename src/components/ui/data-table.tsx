"use client";

import { useState, type ReactNode } from "react";
import { Panel } from "./panel";
import { ResourceState } from "./resource-state";
import styles from "./data-table.module.css";
import { Icon } from "./icon";

export type DataTableColumn<T> = {
  heading: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T extends { id: string }> = {
  title: string;
  description: string;
  rows: T[] | null;
  columns: DataTableColumn<T>[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  searchText: (row: T) => string;
};

export function DataTable<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  isLoading,
  error,
  onRetry,
  searchText,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const filteredRows = rows?.filter((row) =>
    searchText(row).toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Panel
      title={title}
      description={description}
      stackActionOnNarrow
      action={
        <label className={styles.search}>
          <Icon name="search" size={16} />
          <input
            aria-label={`Search ${title.toLowerCase()}`}
            placeholder={`Search ${title.toLowerCase()}...`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      }
    >
      {isLoading || error ? (
        <ResourceState error={error} isLoading={isLoading} onRetry={onRetry} />
      ) : (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>{columns.map((column) => <th key={column.heading}>{column.heading}</th>)}</tr>
            </thead>
            <tbody>
              {filteredRows?.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => <td key={column.heading}>{column.render(row)}</td>)}
                </tr>
              ))}
              {filteredRows?.length === 0 && (
                <tr><td className={styles.empty} colSpan={columns.length}>No records match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
