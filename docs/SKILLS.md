# The skill library

48 repositories were cloned, read, and distilled into this repo. **1,144 unique
`SKILL.md` skills** were found; **162 are vendored in full** into `.claude/skills/`
so any `SKILL.md`-compatible agent (Claude Code, Codex, Cursor, and others) picks
them up automatically. Every one of the rest is indexed in
[`.claude/skills/CATALOG.md`](../.claude/skills/CATALOG.md) with its source repo
and description, so it can be pulled back on demand.

Nothing here is decoration. Each vendored skill was chosen because it either
shaped this build or is the thing you reach for the moment this project grows a
backend, a payment flow, or an auth screen.

## Layout

```
.claude/skills/
  CATALOG.md                    all 1,144 skills, grouped by source repo
  realtime-webgl-surfaces/      authored here — the webgl/glass/flight playbook
  frontend-design/              aesthetic direction, anti-template rules
  emil-design-eng/ …            motion & interaction craft  (16 skills)
  apple-design/                 fluid interfaces, springs, gesture physics
  ui-ux-pro-max/                UI/UX strategy            (7 skills)
  shadcn/                       component layer + Radix→Base UI migration
  vercel-react-best-practices/  React/Next performance
  …                             plus 130 more
```

## What is vendored, by the job it does

**Design and motion** — the skills that built this page.
`frontend-design`, `brand-guidelines`, `theme-factory`, `canvas-design`,
`algorithmic-art`, `web-artifacts-builder`, and the full 16-skill
`emilkowalski/skills` set (`animate`, `animation-performance`,
`animation-vocabulary`, `apple-design`, `emil-design-eng`, `break-ui`,
`review-animations`, `improve-animations`, `remove-animations`, `mobile-native`,
`prototype`, `pick-ui-library`, `find-animation-opportunities`, `ask-sonner`),
plus all 7 `ui-ux-pro-max` skills.

**Frontend engineering** — `vercel-react-best-practices`,
`vercel-composition-patterns`, `vercel-react-view-transitions`,
`web-design-guidelines`, `writing-guidelines`, all 6 `vercel/next.js` skills
(bundle optimiser, cache components, dev loop, prefetching), `shadcn`,
`nextjs-app-router-patterns`, `tailwind-design-system`, `react-state-management`,
`tanstack-*`, `svelte-*`, `vitest`, `vite`, `unocss`, `pnpm`, `antfu`.

**Testing and quality** — `playwright-cli`, `e2e-testing-patterns`,
`webapp-testing`, `break-ui`, `security-review`, `code-review`.

**Backend and data** — `supabase`, `supabase-postgres-best-practices`, `neon`,
`neon-auth`, `neon-postgres`, `postgresql-table-design`, `convex`, `mongodb`,
`redis`, `firebase`, `better-auth`, `clerk` (+ Next.js patterns, custom UI,
webhooks, testing), `api-design-principles`, `architecture-patterns`.

**Money and messages** — `stripe-best-practices`, `stripe-docs`,
`dodopayments`, `polarsource`, `resend`, `react-email`, `email-best-practices`,
`twilio`.

**Ship and observe** — `deploy-to-vercel`, `vercel-optimize`, `docker`,
`kubernetes`, `sentry`, `posthog`, `remotion` (programmatic video),
`scroll-world`, `agent-browser`, `browserbase`, `firecrawl`.

**Marketing** — `seo-audit`, `copywriting`, `cro`, `schema`, `pricing`, `launch`.

## Using them

If you are an agent: read `.claude/skills/CATALOG.md` to find the right skill,
then open that folder's `SKILL.md`. Skills are written to be read at the moment
of need, not memorised.

If you are a person: `CATALOG.md` is a browsable index of what this project can
already do well, and what it can do the moment you point an agent at it.

## Pulling a skill that is catalogued but not vendored

```bash
# whole repo, shallow + sparse (cheap)
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/PostHog/skills.git /tmp/x
git -C /tmp/x sparse-checkout set skills
cp -R /tmp/x/skills/<skill-name> .claude/skills/
```

## Note on the source repos that are not skills

`shadergradient`, `liquid-logo`, `scroll-world`, `liquid-glass-js` and
`react-three-fiber` are libraries and techniques, not `SKILL.md` packages. What
they teach is written up in
[`realtime-webgl-surfaces/SKILL.md`](../.claude/skills/realtime-webgl-surfaces/SKILL.md),
and applied in `lib/shaders/` and `components/`.

One caution, recorded because it is easy to get wrong:
`paper-design/liquid-logo` is **PolyForm Shield 1.0.0** — source-available, not
open source, and it forbids competing use. The liquid-metal shader in this repo
is an independent implementation of the *technique*, not a copy of that code.
