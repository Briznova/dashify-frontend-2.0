export const CAPABILITIES = [
  "platform.overview",
  "schools.read",
  "schools.manage",
  "students.read",
  "students.manage",
  "attendance.read",
  "attendance.manage",
  "academics.read",
  "assignments.manage",
  "finance.read",
  "reports.read",
  "settings.manage",
] as const;

export type Capability = (typeof CAPABILITIES)[number];
