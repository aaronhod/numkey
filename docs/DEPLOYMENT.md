# Deployment

The app deploys to Cloudflare Workers via the
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter
(`wrangler.jsonc`, `open-next.config.ts`), with Supabase providing auth and
Postgres. Pushes to `main` deploy automatically through
`.github/workflows/deploy.yml`.

## Supabase project

- Apply `prisma/schema.prisma` to the project's Postgres and run the seeder
  (`prisma/seed_problems.ts`) once.
- Leave RLS enabled on all tables with no policies: the app reaches Postgres
  exclusively through Prisma's direct connection, so the PostgREST
  `anon`/`authenticated` roles can't touch game data.
- Use the **transaction pooler** connection string (port 6543) with
  `?pgbouncer=true` appended for Prisma — Workers are serverless, so every
  request may open a fresh connection and the pooler absorbs that.

## Environment variables

Set these when `opennextjs-cloudflare build` runs. `NEXT_PUBLIC_*` values are
inlined into the client bundle at build time, and some pages (e.g.
`/practice/flashcards/[setId]`) are statically prerendered from Prisma, so
`DATABASE_URL` must be reachable **during the build**, not just at runtime:

```bash
NEXT_PUBLIC_AUTH_PROVIDER="supabase"
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."   # Dashboard → Settings → API keys
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
```

At runtime, `NODE_ENV`, `NEXT_PUBLIC_AUTH_PROVIDER`, and
`NEXT_PUBLIC_SUPABASE_URL` are plain `vars` in `wrangler.jsonc`; the secrets
are uploaded separately:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The GitHub Actions workflow does both steps on every deploy; it needs the
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_URL`, and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` repository secrets.

## OAuth providers (one-time, dashboard)

Supabase's Management API can't configure OAuth providers, so in
**Auth → Sign In / Up → Providers**:

1. **GitHub** — create a GitHub OAuth app (Settings → Developer settings)
   with callback URL
   `https://<project-ref>.supabase.co/auth/v1/callback`, then paste its
   client ID/secret into the GitHub provider and enable it.
2. **Google** — create an OAuth client in Google Cloud Console (Web
   application) with the same callback URL, then paste its client ID/secret
   into the Google provider and enable it.
3. In **Auth → URL Configuration**, set **Site URL** to the production
   domain and add `https://<production-domain>/api/auth/callback` to the
   redirect allow list.

## Deploying

From a machine or CI with the Cloudflare credentials and the build-time env
vars above:

```bash
bun run cf:preview   # build + run locally in the workerd runtime
bun run cf:deploy    # build + deploy to the Worker
```

`cf:preview` is worth running before shipping runtime-adjacent changes: the
Workers runtime enforces rules Node doesn't (no runtime WASM compilation, no
cross-request socket reuse), and only workerd surfaces those.

After the first deploy, point a custom domain at the Worker (Worker →
Settings → Domains & Routes) and make sure that hostname matches the
Supabase **Site URL** / redirect allow list and the GitHub/Google OAuth app
settings.
