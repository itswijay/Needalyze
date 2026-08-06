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

## Architecture

The codebase follows clean architecture. Dependencies point inward only:

```
   presentation                infrastructure           application        domain
   app/ components/    ──▶     adapters that       ──▶  use cases,    ──▶  entities,
   context/ hooks/             implement the            ports,             rules,
                               ports                    validation         constants
```

| Layer | Contains | May import |
| --- | --- | --- |
| `src/domain` | Entities, business rules, constants. No framework, no I/O. | nothing outside `domain` |
| `src/application` | Use cases, port definitions, zod schemas, view models | `domain`, `zod` |
| `src/infrastructure` | Supabase repositories, auth gateways, PDF renderer, HTTP helpers, the container | `application`, `domain` |
| `src/app`, `src/components`, `src/context`, `src/hooks` | React | `application`, `domain`, `infrastructure/http`, `infrastructure/pdf` |

`eslint.config.mjs` enforces this with `no-restricted-imports`; a violation
fails `npm run lint`.

**Three rules worth knowing:**

1. **The browser never touches the database.** All table and storage access
   happens in a route handler. The one exception is authentication —
   establishing a session has to happen client-side, because the Supabase client
   is what stores and refreshes the token. That is confined to
   `supabaseAuthGateway` and carries an explicit eslint exception in
   `AuthContext`.
2. **Use cases receive their dependencies.** They never import an adapter.
   `infrastructure/container.js` is the only module that wires the two together,
   and route handlers build a container per request because the Supabase client
   is scoped to the caller's token.
3. **Column names live in one place per table** — the mappers under
   `infrastructure/supabase/mappers`. Everything above them speaks camelCase.

### Adding a feature

1. Rule or invariant → `domain/`
2. Orchestration → `application/use-cases/`, depending on a port
3. A new port → declare in `application/ports/`, implement in `infrastructure/`,
   register in `container.js`
4. Expose it → a route handler in `app/api/`, which parses, guards with
   `requireUser`/`requireAdmin`, calls the use case, and returns `toResponse`
5. Consume it → a hook calling `apiClient`

## API

| Route | Auth |
| --- | --- |
| `POST /api/auth/register` | anonymous |
| `GET`/`PATCH`/`DELETE /api/me` | signed in |
| `GET /api/dashboard` | signed in |
| `GET /api/admin/users/pending`, `POST /api/admin/users/[userId]/status`, `GET /api/admin/stats` | admin |
| `POST /api/form-link` | signed in |
| `GET`/`POST /api/form/[linkId]`, `POST .../reset`, `POST .../pdf` | the link itself |

The customer-facing form endpoints are anonymous by design — possession of an
active, unexpired link is the authorisation. They run on the service-role key,
so they validate the link first and derive every ownership field from the link
record rather than from the request.

Responses are `{ success: true, ...data }` or
`{ success: false, code, error }`. `apiClient` unwraps that and throws an
`ApiError` carrying the status and code.

## Scripts

```bash
npm run dev
npm run build   # runs lint; must pass before merging
npm run lint
```

## Further reading

- [EMAIL_VERIFICATION_GUIDE.md](EMAIL_VERIFICATION_GUIDE.md)
- [PDF_STORAGE_GUIDE.md](PDF_STORAGE_GUIDE.md)
- [STORAGE_OPTIMIZATION.md](STORAGE_OPTIMIZATION.md)
