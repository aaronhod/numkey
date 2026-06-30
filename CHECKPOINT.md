# Dependency Update — Session Checkpoint

**Branch:** `claude/mental-math-deps-update-m88c1b`
**Date:** 2026-06-30
**Goal:** Update ALL dependencies and verify they're still compatible and that the app builds/works.

## TL;DR for the next session

The task is **blocked by the environment's network policy**: the npm registry is
unreachable, so dependencies cannot be installed, updated, or verified here. No
files have been changed yet (working tree is clean). Resume by either fixing
network access or by following the chosen fallback (see "Next steps").

## Project facts (gathered)

- T3 Stack app: **Next.js 14.2.4** (pages router), React 18.3.1, TypeScript 5.5.
- Prisma 5.15 (`@prisma/client` + `prisma`), tRPC (`next` dist-tag), TanStack Query 5.
- Clerk auth (`@clerk/nextjs` ^5.1.6), many `@radix-ui/*` packages, Tailwind 3.4.
- mathjs 13, katex, lodash, date-fns 3, dayjs, zod 3, nuqs 1, superjson 2.
- Package manager: **bun** (`bun.lockb` is the committed lockfile). Scripts in
  `package.json` reference `yarn`/`dotenv-cli`, but the lockfile is bun's.
- Build runs `await import("./src/env.js")` which validates env vars via
  `@t3-oss/env-nextjs`. Use `SKIP_ENV_VALIDATION=1` for builds without a DB.
- `postinstall` runs `prisma generate` (needs `prisma/schema.prisma`).
- Tooling available in env: node v22, bun 1.3.11, npm 10.9, pnpm 10.33, yarn 1.22.

## The blocker (confirmed, do not just retry)

All package-registry egress returns **403 (policy denial)** at the agent proxy gateway:

```
kind: connect_rejected
detail: gateway answered 403 to CONNECT (policy denial or upstream failure)
host:   registry.npmjs.org:443        # also registry.npmmirror.com, jsr.io
```

- `registry.npmjs.org` is in the proxy `noProxy` list (meant to go direct) but
  direct GETs also return 403 — so it's a true egress-policy block for this session.
- Verified with `bun install`, `npm install`, direct `curl`, and curl forced
  through `$HTTPS_PROXY`. All 403.
- Only a 126 MB partial npm cache exists (`~/.npm/_cacache`) — leftovers from an
  unrelated install; NOT this project's full tree and NOT updated versions.
- Per `/root/.ccr/README.md`: a 403/407 is an org egress-policy denial — report it,
  do not route around it.

**Implication:** Cannot `install`, cannot fetch newer versions, cannot build to
verify. The "make sure they work" requirement is impossible until the registry
is reachable.

## What was NOT done

- No edits to `package.json`, lockfile, or any source. Working tree is clean.
- No commit, no push.

## Next steps (depends on user's choice — was awaiting answer)

Presented 3 options to the user; awaiting their pick:

1. **(Recommended) Fix network access**, then do the real upgrade:
   - Re-create/reconfigure the web environment with a network policy allowing the
     npm registry (docs: https://code.claude.com/docs/en/claude-code-on-the-web).
   - Then: `SKIP_ENV_VALIDATION=1 bun install` to get a baseline; run
     `next build` (with `SKIP_ENV_VALIDATION=1`), `next lint`, and `tsc --noEmit`
     to confirm the baseline is green.
   - Update deps (e.g. `bunx npm-check-updates -u` or targeted bumps), reinstall,
     re-run build/lint/typecheck, fix breakages, then commit + push to the branch.
   - Watch for known major bumps: Next 14→15, React 18→19, Tailwind 3→4,
     ESLint 8→9 (flat config), Prisma 5→6, zod 3→4, mathjs, lucide-react,
     date-fns, @clerk/nextjs major. Each may carry breaking changes.

2. **Edit package.json blind** (NOT recommended): bump versions from knowledge,
   commit without install/build/verify. High risk of breaking the app.

3. **Upgrade plan only**: write a report of recommended bumps + breaking-change
   risks without modifying files; user runs the real upgrade elsewhere.

## Verification commands (once registry is reachable)

```bash
SKIP_ENV_VALIDATION=1 bun install
SKIP_ENV_VALIDATION=1 npx next build
npx next lint
npx tsc --noEmit
```

## Git reminders

- Develop on `claude/mental-math-deps-update-m88c1b`; push with
  `git push -u origin claude/mental-math-deps-update-m88c1b`.
- Do NOT open a PR unless the user explicitly asks.
- Delete this CHECKPOINT.md before the final commit of the real work (or keep it
  out of the committed deliverable) so it doesn't ship to the repo.
