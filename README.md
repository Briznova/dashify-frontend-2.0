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
NEXT_PUBLIC_DASHIFY_API_BASE_URL=http://localhost:3001
```

Copy `.env.example` to `.env.local` and set the API URL for your backend. The adapters in `src/services/http/` currently expect:

- `POST /auth/sign-in`
- `POST /auth/sign-up`
- `GET /auth/session` (returns the current user or `401`)
- `POST /auth/password-reset/request`
- `POST /auth/password-reset/confirm` (accepts the reset token)
- `POST /auth/sign-out`
- `GET /school/dashboard?role=...`
- `GET /school/portal-dashboard?role=teacher|accountant|parent|student`
- `GET /school/students`, `POST /school/students`, `PUT /school/students/:id`
- `GET /school/staff`, `/school/classrooms`, `/school/attendance`, `/school/reports`, `/school/fees`, and `/school/assignments`
- `GET /schools`
- `GET /school/settings` and `PUT /school/settings`

Successful endpoints return JSON matching the types in `src/types/`. Password-reset request and confirmation may return `204 No Content`. The HTTP client includes credentials so the auth API can set an `HttpOnly`, `Secure`, `SameSite` session cookie; configure CORS accordingly when the API is on another origin. Adjust the small HTTP adapters if your backend uses different paths or response shapes; UI components and hooks can remain unchanged. Production auth must be implemented and enforced by a trusted server/API, not the browser mock.

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
