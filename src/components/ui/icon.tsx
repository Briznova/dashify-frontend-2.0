import type { ReactNode } from "react";

export type IconName =
  | "layoutDashboard"
  | "building"
  | "users"
  | "user"
  | "book"
  | "calendarCheck"
  | "wallet"
  | "chart"
  | "file"
  | "home"
  | "graduationCap"
  | "search"
  | "bell"
  | "settings"
  | "sparkles"
  | "chevronDown"
  | "arrowUpRight"
  | "arrowRight"
  | "menu"
  | "close"
  | "clock"
  | "check"
  | "alert"
  | "receipt"
  | "clipboard"
  | "mail"
  | "info"
  | "lock"
  | "arrowLeft"
  | "refresh";

const iconShapes: Record<IconName, ReactNode> = {
  layoutDashboard: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  building: <><path d="M4 20.5h16M6.5 20.5V4.5h11v16M9.5 8h1m3 0h1m-5 4h1m3 0h1m-4 4h1m3 0h1" /><path d="M10 20.5v-3h4v3" /></>,
  users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" /><circle cx="9.5" cy="7.5" r="3.5" /><path d="M17 11a3.5 3.5 0 1 0-1.2-6.8M17 14.5h1a3 3 0 0 1 3 3V20" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16M8 7h8m-8 4h8" /></>,
  calendarCheck: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4m9-4v4M3.5 9.5h17m-12 5 2.2 2.2 4.8-4.8" /></>,
  wallet: <><path d="M4 6.5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h13" /><path d="M21 11h-5a2 2 0 0 0 0 4h5m-5-2h.01" /></>,
  chart: <><path d="M4 19.5h17M6.5 16V10m5 6V5m5 11v-4m5 4V8" /></>,
  file: <><path d="M6 3.5h8l4.5 4.5v12A1.5 1.5 0 0 1 17 21.5H6A1.5 1.5 0 0 1 4.5 20V5A1.5 1.5 0 0 1 6 3.5Z" /><path d="M14 3.5V8h4.5M8 12h7m-7 4h7" /></>,
  home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" /></>,
  graduationCap: <><path d="m2.5 9 9.5-5 9.5 5-9.5 5zM6 11v5.5c3.5 3 8.5 3 12 0V11m3.5-2v6" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0" /></>,
  settings: <><path d="M4 6h10m4 0h2M4 12h2m4 0h10M4 18h8m4 0h4" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="14" cy="18" r="2" /></>,
  sparkles: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowUpRight: <><path d="M7 17 17 7M8 7h9v9" /></>,
  arrowRight: <><path d="M4 12h15m-6-6 6 6-6 6" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  alert: <><path d="M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 3h.01" /></>,
  receipt: <><path d="M5 3.5h14v18l-3.5-2-3.5 2-3.5-2L5 21.5z" /><path d="M8.5 8h7m-7 4h7m-7 4h4" /></>,
  clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5V3h6v2m-7 6h8m-8 4h8m-8 3h5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" /></>,
  arrowLeft: <><path d="M20 12H5m6 6-6-6 6-6" /></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9a7 7 0 0 1 11.6-2.6L20 12M4 12l2.9 5.6A7 7 0 0 0 18.5 15" /></>,
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {iconShapes[name]}
    </svg>
  );
}
