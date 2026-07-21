# numkey

Fast mental-arithmetic game (number + monkey). Next.js (pages router) + tRPC +
Prisma, styled as a black/white monospace design system.

## Architecture

| Concern    | Development                          | Production                        |
| ---------- | ------------------------------------ | --------------------------------- |
| Auth       | Basic username/password (`dev`/`dev`) | Supabase Auth (GitHub + Google)   |
| Database   | Local Postgres (`start-database.sh`)  | Supabase Postgres (via Prisma)    |
| Guest mode | localStorage                          | localStorage                      |

The auth provider is selected by `NEXT_PUBLIC_AUTH_PROVIDER` (`basic` |
`supabase`); it defaults to `basic` in development and `supabase` in
production builds.

Signed-out visitors get a landing page with two options: **Login** and
**Guest**. Guest mode only offers QuickPlay (`/play`): problems are generated
in the browser and finished games are saved to localStorage, never the
database. Practice and Custom games require an account.

## Development

```bash
bun install
bun run db:start     # local Postgres in Docker
bun run db:push      # apply prisma/schema.prisma
bun run db:setup     # seed problem definitions
bun run dev
```

Sign in with `dev` / `dev` (override with `BASIC_AUTH_USERNAME` /
`BASIC_AUTH_PASSWORD` in `.env.dev`).

## Production (Supabase)

The production project is `czqdhcxbdajdodefumfe` (us-east-1); its dashboard
display name can be renamed to `numkey` in Project Settings.
The schema was applied as the `init_mathgame_schema` migration and the 528
problem definitions are seeded. All tables have RLS enabled with no policies:
the app reaches Postgres exclusively through Prisma's direct connection, so
the PostgREST `anon`/`authenticated` roles can't touch game data.

Environment variables for the production deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://czqdhcxbdajdodefumfe.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."   # Dashboard → Settings → API keys
DATABASE_URL="postgresql://..."                       # Dashboard → Connect → Transaction pooler
# NEXT_PUBLIC_AUTH_PROVIDER defaults to "supabase" in production builds
```

Use the **transaction pooler** connection string (port 6543) for serverless
deployments and append `?pgbouncer=true` for Prisma.

### One-time OAuth provider setup (dashboard)

Supabase's Management API can't configure OAuth providers, so these steps are
manual, in [Auth → Sign In / Up → Providers](https://supabase.com/dashboard/project/czqdhcxbdajdodefumfe/auth/providers):

1. **GitHub**: create a GitHub OAuth app (Settings → Developer settings) with
   callback URL `https://czqdhcxbdajdodefumfe.supabase.co/auth/v1/callback`,
   then paste its client ID/secret into the GitHub provider and enable it.
2. **Google**: create an OAuth client in Google Cloud Console (Web
   application) with the same callback URL, then paste its client ID/secret
   into the Google provider and enable it.
3. In [Auth → URL Configuration](https://supabase.com/dashboard/project/czqdhcxbdajdodefumfe/auth/url-configuration),
   set **Site URL** to the production domain and add
   `https://<production-domain>/api/auth/callback` to the redirect allow list.

### Deploy to Cloudflare Workers (OpenNext)

The app deploys to Cloudflare Workers via the
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter
(`wrangler.jsonc`, `open-next.config.ts`). The Worker is named `mathgame`.

**Build-time env vars** (must be set when `opennextjs-cloudflare build` runs,
so `next build` can inline `NEXT_PUBLIC_*` into the client bundle and prerender
DB-backed pages):

```bash
NEXT_PUBLIC_AUTH_PROVIDER="supabase"
NEXT_PUBLIC_SUPABASE_URL="https://czqdhcxbdajdodefumfe.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."   # Dashboard → Settings → API keys
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"  # transaction pooler
```

The build statically prerenders some pages (e.g. `/practice/flashcards/[setId]`)
that read Prisma, so `DATABASE_URL` must be reachable during the build — not
just at runtime.

**Runtime config** — `NODE_ENV`, `NEXT_PUBLIC_AUTH_PROVIDER`, and
`NEXT_PUBLIC_SUPABASE_URL` are set as plain `vars` in `wrangler.jsonc`. Set the
secrets separately:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY   # if not a build var
```

**Deploy** from a machine/CI with the Cloudflare credentials and the build-time
env vars above:

```bash
bun run cf:preview   # build + run locally in the workerd runtime
bun run cf:deploy    # build + deploy to the mathgame Worker
```

Or connect the repo via **Workers Builds** (Cloudflare dashboard → the
`mathgame` Worker → Settings → Build) and set the build vars/secrets there.

After deploying, point a custom domain at the Worker (Worker → Settings →
Domains & Routes) and make sure that hostname matches the Supabase **Site
URL** / redirect allow list and the GitHub/Google OAuth app settings.

## Testing

```bash
bun run test        # vitest unit tests
bun run typecheck
bun run lint
bun run test:e2e    # Playwright (needs a running database; see .github/workflows/ci.yml)
```
