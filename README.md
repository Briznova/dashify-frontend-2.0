# Dashify

Dashify is a responsive school-management frontend built with Next.js App Router, TypeScript, and CSS Modules. It includes a public landing page, authentication flows, and school administration dashboards. Tailwind CSS is not used.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — Dashify landing page
- `/auth/sign-in` — Sign in to a school workspace
- `/auth/sign-up` — Create an account and school workspace
- `/auth/forgot-password` — Request a password reset
- `/auth/reset-password?token=...&email=...` — Reset a password from a reset link
- `/dashboard` — Role-specific overview for the signed-in user
- `/dashboard/schools` — School directory
- `/dashboard/students` — Student directory and enrollment status
- `/dashboard/students/new` — Create a student profile
- `/dashboard/students/[id]` — Student profile, academics, attendance, fees, and documents
- `/dashboard/students/[id]/edit` — Update a student profile
- `/dashboard/staff` — Staff directory
- `/dashboard/classes` — Classrooms and grade levels
- `/dashboard/attendance` — Daily attendance records
- `/dashboard/fees` — Fee collection and payment status
- `/dashboard/academics` — Assignments and submission overview
- `/dashboard/analytics` — Academic and attendance analytics
- `/dashboard/reports` — Academic reports
- `/dashboard/settings` — School and notification settings
- `/dashboard/teacher`, `/dashboard/accountant`, `/dashboard/parent`, and `/dashboard/student` — Role-focused portal dashboards, available to the matching demo role

## Role dashboard experiences

- **Super Admin** — network-wide enrollment, school portfolio, onboarding notices, and platform activity.
- **School Admin** — school operations, attendance follow-up, today’s attendance, fee collection, enrollment requests, and upcoming notices.
- **Principal** — classroom activity, attendance trends, academic reports, and leadership priorities.
- **Teacher, Accountant, Parent, and Student** — focused teaching, finance, family, and learning workspaces.

The dashboard uses a central UI access policy in `src/modules/access/` to keep role home routing, navigation, and route checks aligned. The access layer defines role capabilities and home destinations, while the workspace modules under `src/modules/workspace/` keep landing experiences and portal-specific composition separate from the shared domain screens.

The sidebar profile stays visible at the lower-left on desktop and shows the signed-in user and role. Open it to view the account email, workspace settings (where available), or sign out.

The dashboard top bar includes role-scoped page search (`Ctrl+K` / `⌘K`, or the search button on mobile) and contextual notifications with direct links to relevant workspace pages.

## Mock and API services

All data access is behind service interfaces in `src/services/`; React hooks in `src/hooks/` expose loading, error, and refresh state to the UI. Mock implementations are the default and run in the browser. Use any of the following sample accounts with the preview password `Dashify123`:

| Role | Username |
| --- | --- |
| Super Admin | `superadmin@school.edu` |
| School Admin | `admin@school.edu` |
| Principal | `principal@school.edu` |
| Teacher | `teacher@school.edu` |
| Accountant | `accountant@school.edu` |
| Parent | `parent@school.edu` |
| Student | `student@school.edu` |

The sign-in preview also accepts any valid email and a password of at least 8 characters, defaulting unknown accounts to School Admin. Mock records, sessions, and password reset tokens are demonstration data only and are not suitable for production authentication.

To switch the service implementations to the HTTP adapters:

```dotenv
NEXT_PUBLIC_DASHIFY_API_MODE=api
NEXT_PUBLIC_DASHIFY_API_BASE_URL=http://localhost:3001/api/v1
```

Copy `.env.example` to `.env.local`. The backend runs on port `3001` by default, while the Next.js frontend runs on port `3000`. In API mode, sign-in calls the backend login endpoint, selects the first active school membership, and stores the returned bearer and refresh tokens in browser storage according to “Remember this device.” Session checks and API requests use the scoped bearer token; sign-out revokes the refresh token.

The current frontend/backend contract is intentionally explicit:

- **Integrated:** backend login, active school selection, current-user session check, logout, and paginated student-directory reads.
- **Not yet implemented/aligned:** sign-up, password reset, dashboard summaries, student create/update form requirements, staff, school directory, classroom presentation fields, attendance summaries, reports, finance, assignments, and settings. API mode surfaces a clear “not implemented” error for these instead of silently falling back to demo data.
- Backend routes and request/response types are documented in the backend Swagger UI at `http://localhost:3001/docs`.

The backend seed account is `admin@dashify.test` / `ChangeMe-Local-Only-2026`; it is separate from the mock preview accounts. Start the backend using its README setup steps and ensure its `.env` has `PORT=3001` and `WEB_APP_ORIGIN=http://localhost:3000`. Successful API responses are mapped at the HTTP service boundary; React components continue consuming the existing frontend types. Production auth and data access must be enforced by the trusted backend, not frontend role checks.

The key boundaries are:

- `src/services/auth-service.ts` and `school-service.ts` — contracts consumed by UI code.
- `src/services/mock/` and `src/services/http/` — replaceable implementations.
- `src/services/index.ts` — selects implementations from `NEXT_PUBLIC_DASHIFY_API_MODE`.
- `src/hooks/` — client hooks expose loading, error, refresh, and form-action state.
- `src/types/` — request and response types shared by the adapters and UI.
- `src/components/ui/` — reusable page headings, metric cards, panels, status badges, data tables, and resource loading/error states.

The dashboard applies role-specific navigation and client-side preview route redirects to keep the mock experience focused. This is UI behavior, not authorization: the backend must scope data and enforce permissions for every request.

## Styling and checks

Global design tokens are in `src/app/globals.css`; route and component styles are colocated as CSS Modules. Shared UI uses reusable React components.

```bash
npm run lint
npm run build
```
