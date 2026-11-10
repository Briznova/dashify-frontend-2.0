# Dashify Frontend: User-Type Modular Structure Plan

## 1. Purpose

This document proposes an incremental frontend structure for Dashify that makes user roles and their workspace experiences easier to understand, extend, and test, while retaining shared domain features.

The target users are:

- Super Admin
- School Admin
- Principal
- Teacher
- Accountant
- Parent
- Student

The plan is for the Dashify frontend repository. It does not prescribe backend module changes or claim that frontend checks provide authorization.

## 2. Current-state summary

The frontend is a Next.js App Router application with three relevant organizational patterns:

1. **Routes are grouped by page/domain.** `src/app/dashboard/` contains common destinations such as students, attendance, fees, academics, reports, and settings, plus separate landing routes for teacher, accountant, parent, and student.
2. **Role-specific behavior is split across shared files.** Role definitions live in `src/types/auth.ts`; role-specific landing content is selected in `src/components/dashboard-home.tsx`; navigation, route availability, settings visibility, and role notifications are implemented in `src/components/dashboard-shell.tsx`; and post-auth routing is implemented in `src/lib/dashboard-route.ts`.
3. **Data access is domain-oriented.** Shared school data is exposed through `src/hooks/use-school-data.ts` and `src/services/school-service.ts`, with mock and HTTP implementations selected in `src/services/index.ts`.

This structure has useful foundations: domain data is not duplicated per role, the API adapter boundary is already established, and the dashboard shell uses the authenticated session to shape navigation. The main structural gap is that role capabilities and user experience are not represented in one clear module. As a result, role behavior can drift across navigation, route checks, dashboard composition, notifications, and feature pages.

## 3. Goals

- Make each role's purpose, landing workspace, navigation, and allowed frontend destinations discoverable in one access/workspace structure.
- Keep shared domains (students, academics, attendance, finance, reports, and settings) reusable rather than cloning them per role.
- Keep App Router files thin: they should route to a workspace or feature entry point, not own role policy.
- Preserve the existing `AuthSession`, service interfaces, mock/API selection, and user-facing behavior during migration.
- Improve maintainability and testability of role-to-capability decisions.
- Make it explicit that UI access policy is for navigation and UX; the trusted API remains responsible for authorization and tenant scoping.

## 4. Non-goals

- Replacing the backend authorization model or introducing frontend-only security.
- Rewriting the service layer, changing API contracts, or moving data-fetching logic into route files.
- Duplicating every domain feature under every role.
- Introducing a permission-management UI, configurable custom roles, or a new state-management library.
- Reworking unrelated route naming or placeholder/legacy destinations as part of this structural migration.

## 5. Proposed target structure

Use a **role-oriented workspace layer over shared domain modules**. Workspaces compose domain features; they do not own separate copies of the domain data or APIs.

```text
src/
  app/
    dashboard/
      layout.tsx
      page.tsx
      teacher/page.tsx
      accountant/page.tsx
      parent/page.tsx
      student/page.tsx
      students/...
      academics/...
      attendance/...
      fees/...
      reports/...
      settings/...
  modules/
    access/
      roles.ts
      capabilities.ts
      role-policy.ts
      navigation.ts
      route-access.ts
      index.ts
    workspace/
      super-admin/
        workspace.tsx
        ...
      school-admin/
        workspace.tsx
        ...
      principal/
        workspace.tsx
        ...
      teacher/
        workspace.tsx
        ...
      accountant/
        workspace.tsx
        ...
      parent/
        workspace.tsx
        ...
      student/
        workspace.tsx
        ...
    students/
      ...
    academics/
      ...
    attendance/
      ...
    finance/
      ...
    reports/
      ...
    schools/
      ...
    settings/
      ...
  components/
    ui/
    layout/
  hooks/
  lib/
  services/
    ...
  types/
    ...
```

This is a destination, not a requirement to move all existing files in one change. Keep existing service and type locations until a specific extraction has a clear benefit. In particular, do not move or rename the mock and HTTP adapters merely to match the diagram.

### Module responsibilities

#### `modules/access`

The access module is the single frontend source for role identity and presentation-level policy:

- Role and role-group types, or re-exports of the canonical role type.
- Capability identifiers such as viewing students, taking attendance, reviewing assignments, viewing fees, managing schools, and editing settings.
- A typed role policy mapping roles to capabilities and role-specific workspace metadata.
- Navigation items derived from the same policy/capability definitions where practical.
- A pure route-access helper used by the dashboard shell and tests.

Keep this policy declarative and deterministic. Avoid importing React components, hooks, service instances, or browser-only code into policy definitions.

#### `modules/workspace/<role>`

Each workspace module owns role-specific composition and presentation: the landing view, role-specific summaries, and links/actions that are unique to that audience. It may consume shared domain components and existing hooks/services.

Role workspaces should not create their own copies of student, attendance, fee, or assignment records. Shared domain views should accept the minimum necessary context or data props and expose role-appropriate actions through explicit UI composition.

#### `modules/<domain>`

Domain modules group UI, hooks, and domain-specific types for a feature where that improves cohesion. A domain can remain shared across roles, while access policy determines which roles see its routes or actions.

The initial migration should prioritize consolidating role policy and separating workspace composition. Domain-by-domain moves can happen later, as incremental follow-up work.

#### `app/dashboard`

App Router pages and layouts should remain route adapters. They can render a shared feature entry point or the appropriate role workspace, but must not become the source of the role matrix.

## 6. Role and capability model

Do not treat role names as a complete substitute for authorization. For frontend composition, define explicit capabilities and map the seven current roles to them. The initial mapping below is a **planning baseline** and must be confirmed against product requirements before implementation; it is not authorization truth.

| Role | Workspace scope | Example frontend capabilities to confirm |
|---|---|---|
| Super Admin | Platform / multi-school | View platform overview, browse schools, view cross-school reporting |
| School Admin | One school | View school operations, manage students and staff, view attendance and finance, manage school settings |
| Principal | One school / leadership | View school overview, attendance and academic reports, review school activity |
| Teacher | Assigned classes | View teaching workspace, classes, attendance, and assignments |
| Accountant | School finance | View finance workspace, fees, and finance reports |
| Parent | Linked child or children | View child-focused updates, attendance/learning summaries, and school notices |
| Student | Own learning context | View own assignments, classes, and learning summaries |

Important modeling details:

- Keep the role union a closed, compile-time set unless product requirements introduce custom roles.
- Distinguish **role** (who the user is in the current frontend session) from **capability** (which UI features are presented) and **scope** (which school, class, or student records the API returns).
- Model the Super Admin's platform scope separately from a school workspace where needed; do not imply that a school name or route alone establishes tenant scope.
- Prefer positive capability checks such as `can(role, "attendance.read")` over scattered comparisons such as `role === "teacher"` in unrelated components.
- Do not infer sensitive permissions only from a route being present in navigation.

An illustrative policy shape (not a required implementation signature):

```ts
type Capability =
  | "schools.read"
  | "students.read"
  | "students.manage"
  | "attendance.read"
  | "attendance.manage"
  | "academics.read"
  | "assignments.manage"
  | "finance.read"
  | "reports.read"
  | "settings.manage";

type RolePolicy = {
  homePath: string;
  capabilities: readonly Capability[];
  navigation: readonly NavigationItem[];
};
```

Use repository-consistent names and types when implementation begins. Avoid adding capabilities that do not correspond to an existing or approved frontend behavior.

## 7. Route and navigation design

1. Preserve the current URL structure during the first migration to avoid breaking bookmarks and existing links.
2. Keep the role home route selection in a pure helper or access policy. Both authentication completion and the dashboard shell should use the same role home-path source.
3. Keep navigation construction and route-access decisions aligned. Where possible, derive both from the same declarative role policy rather than maintaining independent arrays and conditions.
4. Preserve route exceptions only when explicitly represented and tested. Existing compatibility aliases such as `/dashboard/customers` and `/dashboard/projects` should not silently become new policy patterns.
5. Keep the shell responsible for session loading, redirect UX, shared layout, and rendering policy-driven navigation. Keep role-specific home content in workspace modules.
6. Route checks in the client must be described as convenience/UX behavior. API calls must independently authenticate, authorize, and scope every request.
7. Consider server-side route protection only if the app's auth/session implementation supports it reliably; do not assume client component redirects are a security boundary.

## 8. Migration plan

Implement in small, behavior-preserving phases. Each phase should be independently reviewable and reversible.

### Phase 0 — Confirm policy and establish baseline

- Confirm product expectations for all seven roles, particularly whether School Admin and Principal can manage the same resources and whether Super Admin has cross-school access.
- Confirm each role's allowed destinations and actions, including settings, finance, reports, attendance, and students.
- Record current behavior: role home route, sidebar items, settings visibility, notifications, and redirects for each demo role.
- Identify current route aliases and any routes that are present but not linked from navigation.
- Capture baseline lint/build results before structural edits.

**Exit criteria:** approved role/capability matrix and a documented baseline route matrix.

### Phase 1 — Centralize role policy without moving pages

- Introduce `modules/access` with shared role policy, capability identifiers, navigation metadata, home paths, and pure route checks.
- Replace duplicated role lists in dashboard home, auth redirect selection, and dashboard shell with access-module calls.
- Keep UI labels, route URLs, icons, and redirects unchanged.
- Add unit tests for role policy completeness and route decisions.

**Exit criteria:** one policy source covers every role and all seven roles continue to land on the same workspace and see the same allowed navigation as before.

### Phase 2 — Extract workspace entry points

- Create one workspace entry module per role, starting with the existing school-admin group and portal roles.
- Move the role-specific branching currently in the generic dashboard home into a small workspace resolver or role-to-workspace component.
- Keep existing dashboard URLs as thin wrappers rendering the relevant workspace entry.
- Preserve shared dashboard layout, loading/error handling, hooks, and service calls.
- Avoid splitting a role into extra submodules unless it has meaningful independent UI or behavior.

**Exit criteria:** route files remain thin, all role landing screens render their prior content, and workspace components have tests or verifiable role-specific render coverage.

### Phase 3 — Align shared feature routes with capabilities

- Review each existing domain route (schools, students, staff, classes, attendance, fees, academics, analytics, reports, and settings).
- Apply the centralized capability policy to frontend navigation and route UX where it is currently needed.
- Keep shared feature views and service methods domain-oriented.
- Identify and document role-appropriate differences in actions, not just page visibility.
- Remove remaining hard-coded role comparisons only when their behavior is represented accurately by policy.

**Exit criteria:** route availability, navigation visibility, and role-specific actions use the same policy and are covered by role matrix tests.

### Phase 4 — Incrementally group domain implementation

- Move a domain only when its UI/hooks/types can be grouped coherently without circular dependencies or broad import churn.
- Start with a self-contained domain, then migrate other areas as follow-up changes.
- Keep `services/` as the adapter boundary until there is a specific benefit and an agreed migration plan to domain-owned service interfaces.
- Preserve mock/API parity and existing service contracts throughout.

**Exit criteria:** every moved domain has stable imports, retained adapter behavior, and relevant tests; no bulk reorganization is needed to claim completion of the user-type plan.

### Phase 5 — Documentation and cleanup

- Update the frontend README's role dashboard and route descriptions to match the implemented policy.
- Document that client-side route checks are not authorization.
- Remove obsolete policy branches only after confirming equivalent behavior and test coverage.
- Review accessibility, redirect loops, loading/error states, and mobile navigation across roles.

**Exit criteria:** code, tests, and product documentation agree on role workspaces and frontend access behavior.

## 9. Testing and acceptance criteria

### Policy unit tests

- Every `UserRole` has exactly one home route and a defined policy.
- Every navigation route references a valid route/capability.
- Route matching handles exact paths and nested paths intentionally.
- Unknown or malformed role input is not silently treated as a privileged role.
- Platform-only and school-only routes are distinguished where product policy requires it.
- Compatibility route aliases preserve current behavior until explicitly retired.

### Workspace and route tests

- Each role renders the correct landing workspace.
- Each role sees only the navigation items allowed by the approved matrix.
- Direct navigation to a disallowed frontend route redirects to that role's expected home route or an agreed access-denied state.
- Session loading, unauthenticated, and session-error states remain correct.
- Authentication redirects after sign-in and sign-up use the same home-route mapping.

### Data and integration checks

- Mock and HTTP service implementations continue to satisfy the same interfaces.
- Domain hooks continue to expose loading, error, refresh, and mutation states.
- Role-specific UI does not assume that hidden navigation means protected data.
- Backend authorization and tenant isolation are validated separately; frontend tests cannot establish those controls.

### Build validation

- Run the repository lint command and production build after each structural phase.
- Run focused tests for access policy, route behavior, and workspace rendering; add a broader suite only if existing coverage warrants it.
- Check for stale imports and type errors after each move.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Frontend role policy is mistaken for security | Clearly label it as UI policy; keep API authorization, tenant scope, and object-level checks independent |
| Role behavior changes during extraction | Capture current behavior first; preserve route URLs and add matrix tests before moving components |
| Capability list becomes overengineered | Start only with capabilities needed by existing routes/actions; add new identifiers with approved behavior |
| Shared pages become hard to maintain | Keep domain feature components shared and pass explicit context/actions rather than cloning them per role |
| Access policy imports UI or data code | Keep policy pure and dependency-light; UI consumes policy, not the reverse |
| Role and school scope are conflated | Model workspace scope separately and rely on the API for authoritative school/student/class filtering |
| Large file moves obscure functional changes | Separate policy extraction from workspace and domain file moves; migrate incrementally |
| Existing stale or placeholder routes complicate access rules | Preserve them as-is initially and handle route cleanup as a separately scoped product decision |

## 11. Recommended first implementation slice

The first code change should be deliberately small:

1. Add a typed access policy module defining the current seven roles, role home paths, and existing navigation/route access.
2. Update the dashboard shell, dashboard home, and post-auth redirect helper to consume it.
3. Add focused tests proving the current role-to-home, navigation, and route behavior is unchanged.
4. Do not move domain components or change routes in that first slice.

This establishes a reliable policy boundary before reorganizing workspace and domain files.

## 12. Definition of done

The user-type modularization is complete when:

- Every current role has an explicit, reviewed workspace and frontend capability policy.
- Role home selection, navigation, and frontend route UX are driven by the centralized policy.
- Role workspace composition is separated from shared domain features.
- Shared domain data and service contracts are not duplicated by role.
- Automated tests cover the approved role matrix and key route decisions.
- Existing routes and expected behavior are preserved or explicitly approved for change.
- Documentation states the frontend/backend authorization boundary clearly.
