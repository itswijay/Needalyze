# Needalyze

An advisor generates a shareable link, a customer fills in a four-step insurance
need analysis, and the advisor reviews the results on a dashboard. Next.js 15
(App Router) on Supabase.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

`.env.local` needs:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key — browser auth, and server reads as the caller |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Bypasses RLS; never exposed to the browser |
| `NEXT_PUBLIC_BASE_URL` | Public origin, used to build shareable form links |
| `NEXT_PUBLIC_ROLE_USER_ID` / `NEXT_PUBLIC_ROLE_ADMIN_ID` | Optional overrides for the role UUIDs |

One dashboard setting is also required: add `{origin}/reset-password` to
**Authentication → URL Configuration → Redirect URLs**, or password-reset emails
will bounce. See [EMAIL_VERIFICATION_GUIDE.md](EMAIL_VERIFICATION_GUIDE.md).

## Architecture

Clean architecture. Dependencies point inward only — an inner layer never knows
what is outside it:

```
  presentation           infrastructure          application         domain
  app/ components/  ──▶  adapters that     ──▶   use cases,    ──▶   entities,
  context/ hooks/        implement the           ports,              rules,
                         ports                   validation          constants
```

| Layer | Contains | May import |
| --- | --- | --- |
| `src/domain` | Entities, business rules, constants. No framework, no I/O. | nothing outside `domain` |
| `src/application` | Use cases, port definitions, zod schemas, view models | `domain`, `zod` |
| `src/infrastructure` | Supabase repositories, auth gateways, PDF renderer, HTTP helpers, the container | `application`, `domain` |
| `src/app`, `src/components`, `src/context`, `src/hooks` | React | `application`, `domain`, `infrastructure/http`, `infrastructure/pdf` |

`eslint.config.mjs` encodes these boundaries as `no-restricted-imports` rules.
They are currently set to **`warn`**, so a violation shows in `npm run lint`
output but does not fail the command. Change `"warn"` to `"error"` in
`DEPENDENCY_RULE` if you want the build to reject them.

```
src/
  domain/                        no imports from any layer below
    constants/                   roles, positions, branches, userStatus,
                                 formStatus, needCategories
    entities/                    needAnalysis, formLink, userProfile
    services/                    humanLifeValue, age, rolePolicy,
                                 needAnalysisStats, money
    errors/                      DomainError and its subclasses
  application/
    ports/                       JSDoc contracts: repositories, authGateway,
                                 fileStorage, pdfRenderer
    use-cases/                   auth/ profile/ admin/ form-link/ need-analysis/
    validation/                  zod schemas shared by browser and server
    view-models/                 entity → UI shape
    result.js                    Result.ok / Result.fail
  infrastructure/
    supabase/                    clients, mappers, repositories, auth gateway,
                                 PDF storage
    pdf/                         needAnalysisTemplate, html2canvasPdfRenderer
    http/                        apiClient, requireUser/requireAdmin, response
    container.js                 composition root
  app/                           routes and route handlers
  components/ context/ hooks/    React
  lib/utils.js                   the Tailwind `cn` helper, nothing else
```

### Four rules worth knowing

1. **The browser never touches the database.** All table and storage access
   happens in a route handler. The one exception is authentication — establishing
   a session has to happen client-side, because the Supabase client is what
   stores and refreshes the token. That is confined to `supabaseAuthGateway`
   (sign in, sign out, session reads, password reset) and carries an explicit
   eslint exception in `AuthContext`.
2. **Use cases receive their dependencies.** They never import an adapter.
   `infrastructure/container.js` is the only module that wires the two together,
   and route handlers build a container per request because the Supabase client
   is scoped to the caller's token.
3. **Column names live in one place per table** — the mappers under
   `infrastructure/supabase/mappers`. Everything above them speaks camelCase.
4. **Validation is shared, not duplicated.** The pages pass the schemas in
   `application/validation` to `zodResolver`, and the use cases re-parse with the
   same schema server-side. A rule relaxed in the UI cannot quietly stop being
   enforced.

### Adding a feature

1. Rule or invariant → `domain/`
2. Orchestration → `application/use-cases/`, depending on a port
3. A new port → declare in `application/ports/`, implement in `infrastructure/`,
   register in `container.js`
4. Expose it → a route handler in `app/api/`, which parses, guards with
   `requireUser`/`requireAdmin`, calls the use case, and returns `toResponse`
5. Consume it → a hook calling `apiClient` (see `hooks/useDashboard.js`)

## API

| Route | Auth |
| --- | --- |
| `POST /api/auth/register` | anonymous |
| `GET`/`PATCH`/`DELETE /api/me` | signed in |
| `GET /api/dashboard` | signed in |
| `POST /api/form-link` | signed in |
| `GET /api/admin/users/pending`, `POST /api/admin/users/[userId]/status`, `GET /api/admin/stats` | admin |
| `GET`/`POST /api/form/[linkId]`, `POST .../reset`, `POST .../pdf` | the link itself |

The customer-facing form endpoints are anonymous by design — possession of an
active, unexpired link is the authorisation. They run on the service-role key,
so they validate the link first and derive every ownership field from the link
record rather than from the request.

Responses are `{ success: true, ...data }` or `{ success: false, code, error }`.
`apiClient` unwraps that and throws an `ApiError` carrying the status and code.

Sign-in, password reset and PDF rasterising are the work that does *not* go
through a route handler, because each needs the browser: the first two need the
session the Supabase client holds, and html2canvas needs a live DOM. The PDF is
still uploaded server-side, so the browser never picks its storage path.

## Testing

```bash
npm test          # once
npm run test:watch
```

Vitest over the pure layers — validation schemas, domain services and the
`userProfile` entity. No DOM, no network, so the suite runs in a few seconds.
Tests are colocated as `*.test.js`.

Assertions check **exact message strings**, not just pass/fail. That matters
here: zod 4 ignores the `required_error` option that zod 3 used, so a schema
carrying it still rejects bad input while showing the wrong message — a failure
mode that `expect(result.success).toBe(false)` would sail straight past.

Route handlers, repositories and components are not covered. Verify those by
running the app.

## Scripts

```bash
npm run dev
npm run build     # runs lint; eslint errors fail the build, warnings do not
npm run lint
npm test
```

## Further reading

- [EMAIL_VERIFICATION_GUIDE.md](EMAIL_VERIFICATION_GUIDE.md) — signup, email verification, admin approval, password reset
- [PDF_STORAGE_GUIDE.md](PDF_STORAGE_GUIDE.md) — how a report is rendered and where it is stored
- [STORAGE_OPTIMIZATION.md](STORAGE_OPTIMIZATION.md) — options for reducing what is written
