# Akinmade Faruq Adeoye — portfolio

Three complete readings of one electrical engineer, sharing a single content
model. Pick one, delete the other two, or ship all three behind the switcher in
the nav.

| Route | Variant | Hero |
|---|---|---|
| `/` | **Flux** | Stream lines of a real magnetic dipole, computed from ψ = sin θ / r. Name set in type. |
| `/chrome` | **Chrome** | A distorted liquid-chrome form in 3D, with the wordmark poured in a custom liquid-metal fragment shader. |
| `/energy` | **Energy** | A rotor under load — concentric poles, rotating segments, a live power trace. |

Everything below the hero is identical across all three: the same five featured
projects, the full 26-project catalogue with discipline filters, the three
Primavera P6 models, five research records, about, experience, 28 credentials
and contact. Only the accent, the light temperature and the hero surface change.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

## Deployment

Live on Vercel as project **`faruk-portfolio`**, building the branch
`arena/778253f2-portfolio-website`. One deployment serves all three readings —
these are three routes of one app, not three apps:

| Route | URL |
|---|---|
| Flux | https://faruk-portfolio-fharuks-projects.vercel.app/ |
| Chrome | https://faruk-portfolio-fharuks-projects.vercel.app/chrome |
| Energy | https://faruk-portfolio-fharuks-projects.vercel.app/energy |

All three prerender to static HTML (`○` in the build output); there is no
runtime dependency on a server.

### GitHub Pages — second, wall-free copy

The same three routes are also published at
<https://fharuk.github.io/PORTFOLIO_WEBSITE/>, built by
`.github/workflows/pages.yml` on every push to this branch. Vercel remains the
primary URL; this is a second copy with no account dependency and no protection
layer. The repository is public, which is what makes Pages available on the Free
plan in the first place.

Pages can only serve files, so that job builds a static export rather than the
Next.js server output. `STATIC_EXPORT=1` turns on `output: 'export'` and
`STATIC_BASE_PATH` supplies the `/<repo>/` prefix a project site needs — without
it the CSS, chunks and portrait all 404, because `next/image` does not prefix
`/public` assets with `basePath`:

```bash
STATIC_EXPORT=1 STATIC_BASE_PATH=/PORTFOLIO_WEBSITE npm run build   # → out/
```

Two consequences of exporting: images are unoptimised, since there is no
optimiser to call, and anything needing a server at runtime would not work.
Neither applies here — all pages prerender and the WebGL surfaces run on the
client.

### Metadata, canonical URLs and the share card

`lib/site-url.ts` is the single source of truth for where the site lives. It
resolves the origin as `NEXT_PUBLIC_SITE_URL` → Vercel's build-time
`VERCEL_PROJECT_PRODUCTION_URL` → localhost, and exposes `p()` for root-relative
paths with the base path applied.

That helper exists because `basePath` is **not** applied automatically to
hand-written paths or `next/image` sources. On GitHub Pages an unprefixed
`/og.png` resolves to `fharuk.github.io/og.png` — the wrong directory — so every
metadata URL goes through `p()`.

Each route declares itself canonical via `lib/metadata.ts`. That helper builds
the whole OpenGraph block rather than just its title, because Next **replaces** a
parent's `openGraph` object wholesale instead of deep-merging: a page that set
only `openGraph.title` would silently lose the share image.

The share card is a committed 1200×630 PNG at `public/og.png`, generated with
satori (`next/og`) rather than a `opengraph-image.tsx` route, because dynamic
image routes are unavailable under `output: 'export'`. Regenerate it after
changing the copy:

```bash
npm run og
```

Fonts: satori rejects woff2 and cannot parse this variable font's `fvar` table,
so `scripts/fonts/` holds a static weight-600 instance converted with fonttools.

Also emitted: `app/icon.svg` (favicon), `app/sitemap.ts` and `app/robots.ts`.
Both metadata routes need `export const dynamic = 'force-static'` — without it
the `output: 'export'` build fails outright.

`npm run lint` runs real ESLint (`eslint .`), not `next lint`, which was removed
in Next 16 and otherwise drops into an interactive setup prompt.

**Node is pinned to `22.x`** in `package.json`. Vercel's project default is
`26.x`, and a bare range such as `>=20` resolves to the newest release. The
pin is deliberate: pin the major, not a range.

**Deployment protection must stay off.** New Vercel projects default to
`all_except_custom_domains`, which makes the `.vercel.app` URLs answer with a
"Protected Deployment" login wall instead of the site — visible only to people
already signed into the Vercel account, i.e. invisible to everyone the portfolio
is for. It has been disabled here. If protection is ever re-enabled: project →
**Settings → Deployment Protection → Vercel Authentication → Disabled**, save,
and it takes effect immediately with no redeploy. Attaching a custom domain also
bypasses it, since the default setting exempts custom domains.

Verify from a signed-out context, not a signed-in browser — a logged-in owner
passes straight through the wall and sees a working site either way.

Redeploy after a push:

```bash
git push origin arena/778253f2-portfolio-website
# then promote a new production build, e.g.:
npx vercel --prod
```

Canonical and OpenGraph URLs are derived at build time from
`NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `localhost`, so
nothing here needs editing when a custom domain is attached.

## The content

Real, not placeholder. Sourced from the existing portfolio at
`fharuk.github.io/portfolio` and the documents in the shared Drive folder:

- 26 projects across engineering (7), AI & data (9), software & IT (6) and research (4)
- 3 Primavera P6 planning models — 300 MW offshore wind BoP, pipeline rehabilitation, pipeline replacement — with their activity, relationship, assignment and risk counts
- 5 research records on Zenodo
- B.Eng. Electrical & Electronics Engineering, FUNAAB, July 2025
- ~28 credentials, grouped by what they are for

Every metric on the page is labelled as what it is: a reported project- or
dataset-level result, not validated field performance. The disclaimer in the
footer is part of the design, not boilerplate.

All of it lives in **`content/site.ts`**. Nothing else needs editing to change
what the site says.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Three.js ·
React Three Fiber 9 · drei · Motion · Lenis.

## Code map

```
app/
  page.tsx            variant A — flux
  chrome/page.tsx     variant B — chrome
  energy/page.tsx     variant C — energy
  layout.tsx          fonts, nav, smooth scroll
  globals.css         tokens, type scale, glass, per-variant accents
content/site.ts       all copy, all data
components/
  site-shell.tsx      composes the page; every variant renders through this
  hero/               three heroes + the shared shader canvas + liquid metal
  work/               the scroll-scrubbed 3D flight
  sections/           statement, work, planning, research, about, experience,
                      credentials, contact, footer
  chrome/             nav + variant switcher, smooth scroll
lib/
  shaders/            GLSL — flux field, energy field, liquid metal
.claude/skills/       162 vendored agent skills + a catalog of 1,144
docs/
  DESIGN.md           why it looks like this, and what was refused
  SKILLS.md           the skill library
```

## Three heroes, one budget

Each variant mounts exactly one WebGL context, gated behind an
`IntersectionObserver` and torn down when it leaves the viewport. The 3D chrome
scene is skipped entirely on touch devices, where it falls back to a painted
form. Every surface has a CSS fallback painted underneath it, so a visitor with
WebGL off sees a finished page.

`prefers-reduced-motion` gets a static frame, not a slower animation.

## The skills

48 repositories were cloned and read to build this. What survived is checked in:
162 skills vendored under `.claude/skills/`, indexed against all 1,144 found.
See [`docs/SKILLS.md`](docs/SKILLS.md) and
[`.claude/skills/realtime-webgl-surfaces`](.claude/skills/realtime-webgl-surfaces/SKILL.md).

> `paper-design/liquid-logo` is PolyForm Shield licensed. It was studied for its
> model, not copied — the shader in `lib/shaders/` is an independent
> implementation.
