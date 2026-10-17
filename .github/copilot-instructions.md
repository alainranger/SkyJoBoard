# Copilot onboarding instructions for SkyJoBoard

Summary
- What this repo is: a Svelte/SvelteKit web app that implements a scoreboard for the SkyJo card game (UI served with Vite / SvelteKit).
- Primary languages/frameworks: Svelte (v5), Vite, TypeScript (used), Tailwind (present in dev deps). The project is private and built as a SvelteKit app with adapter-auto.

Repository facts (quick)
- Repo size: small-to-medium single-page SvelteKit app.
- Key dev dependencies (from package.json): svelte ^5.45.6, @sveltejs/kit ^2.49.1, vite ^7.2.6, typescript ^5.9.3, tailwindcss ^4.1.17, prettier, eslint, svelte-check.
- No automated test framework configured (no "test" script in package.json).
- No GitHub Actions workflows detected at root (if a workflow is later added, follow it to replicate CI locally).

Developer / build environment assumptions
- Recommended Node version: Node 18+ (modern LTS); npm compatible with the lockfile (npm 9+ recommended).
- Always run dependency installation before other steps: either `npm ci` (CI) or `npm install` (local).
- Because TypeScript config extends `.svelte-kit/tsconfig.json`, run svelte-kit sync before running type checks or svelte-check so the generated `.svelte-kit` config exists.

Build / dev / validate (explicit sequences you should follow)
- Bootstrap (first time or CI):
  1. npm ci
  2. npm run prepare
     - This runs `svelte-kit sync` which generates `.svelte-kit` files referenced by tsconfig.json.
  3. npm run check   (optional step to run svelte-check/type checking)

- Development (quick):
  - `npm run dev` — starts Vite dev server.
  - `npm run dev -- --open` — opens in browser.
  - Alternate: `npm run dev:ngrok` — runs `node update-ngrok-url.js` then `vite dev`. Use only if you need an ngrok URL; ensure ngrok URL setup is valid for your environment.

- Build / Preview:
  1. npm run build   — produces production build via Vite.
  2. npm run preview — locally preview the built site.
  - If build fails due to hosting requirements, the `@sveltejs/adapter-auto` may choose an adapter; pick an explicit adapter for the target environment (e.g., adapter-node, adapter-static) and re-run build.

- Linting / formatting:
  - `npm run format` — Prettier writes formatting changes.
  - `npm run lint` — Prettier check + ESLint. Always run before opening PRs.

- Type checking:
  - `npm run check` — runs `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`.
  - IMPORTANT: svelte-check requires `.svelte-kit/tsconfig.json` to exist — run `npm run prepare` first.

Known pitfalls & guidance to avoid CI/build failures
- Always run `npm ci` / `npm install` before any build or check. Failure to generate `.svelte-kit` (via svelte-kit sync) will cause TypeScript and build errors because tsconfig.json extends the generated config.
- If you run `svelte-check` or TypeScript checks and see missing `.svelte-kit` references, run `npm run prepare` to generate them.
- The repo uses `adapter-auto` — in CI or production this may select a default adapter; if the target host requires a specific adapter, add/lock that adapter and verify `npm run build` locally.
- No tests are configured—avoid assuming unit tests exist. If adding tests, update package.json scripts and CI accordingly.
- If code style/lint errors block CI, run `npm run format` and `npm run lint` locally and fix issues before PR.

Project layout and key files (priority order)
- package.json — scripts and devDependencies (scripts: dev, dev:ngrok, update:ngrok, build, preview, prepare, check, format, lint).
- README.md — basic developer commands and notes.
- svelte.config.js — SvelteKit config; uses vitePreprocess and adapter-auto.
- vite.config.ts — Vite configuration for dev/build.
- tsconfig.json — extends `./.svelte-kit/tsconfig.json` (generated).
- eslint.config.js — project ESLint configuration.
- update-ngrok-url.js — script used by `dev:ngrok` and `update:ngrok`.
- src/
  - src/routes/+page.svelte — main application page (largest UI file).
  - src/routes/+layout.svelte — global layout for routes.
  - src/app.html — HTML template.
  - src/lib/index.ts — $lib alias entry (empty placeholder).
- static/ — static assets served by Vite/preview.

Checks run prior to check-in (recommended local replication)
- Minimal checklist to run locally before opening a PR:
  1. npm ci
  2. npm run prepare
  3. npm run build
  4. npm run preview (optional smoke test)
  5. npm run check
  6. npm run format
  7. npm run lint
- On CI, prefer using `npm ci` and replicate the same commands. If CI introduces timeouts, running `npm run build` is the most important step to ensure PRs do not break production build.

When making edits
- Small UI/HTML/CSS changes: ensure `npm run dev` and the browser preview show expected behavior.
- Type changes: run `npm run check` after `npm run prepare`.
- Always run `npm run format` and `npm run lint` before committing. Many PR rejections are due to lint or formatting failures.

Search guidance for the agent (when to search the repo)
- Trust these instructions first. Only search the repository if:
  - A required file or config is missing (for example `.svelte-kit` generated files).
  - A command here fails locally and error messages reference a specific file or config not documented above.
  - You need to find a specific component, route, or helper not listed in the Project layout above.
- Prefer inspecting:
  - package.json (scripts & deps)
  - svelte.config.js, vite.config.ts, tsconfig.json
  - src/routes for UI changes

Final notes (agent trust)
- These steps were derived from the repo's package.json and top-level config files. Follow them in order; they minimize common causes of build and CI failures (missing generated tsconfig, missing install step, formatting/linting issues).
- If any command behaves differently in your environment, re-run `npm run prepare` and `npm ci` first, then search the repo for scripts or config referenced in error text.
