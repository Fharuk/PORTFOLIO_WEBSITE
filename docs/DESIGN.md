# Design decisions

What was chosen, what was refused, and what changed when the real subject
arrived. Written so the next person extends this instead of fighting it.

## The brief, corrected

The first pass was built for an imagined *design engineer* — a WebGL specialist.
The real subject is an **Electrical & Electronics Engineer** working
across power systems, applied machine learning, Primavera P6 planning and
technical support, in Lagos.

That is not a persona tweak. The liquid-chrome hero, the "design systems"
capability list, the invented projects — all of it was wrong and was removed.
What survived was the craft layer: the type system, the motion rules, the glass,
the scroll engine. What replaced the content is his actual record: 26 projects,
3 P6 models, 5 Zenodo records, 36 credentials, and three degrees — two of them
still in progress, which the Education block says out loud.

The lesson recorded here on purpose: **a portfolio's visuals are downstream of
who the person is.** I should have asked for the subject before building.

## Three variants, one page

The same person read three ways. Structural markup, spacing, type scale and
every section below the hero are identical — they render through one
`SiteShell`. Only three things change:

| Variant | Hero surface | Accent | What it argues |
|---|---|---|---|
| **Flux** (`/`) | Dipole stream lines, ψ = sin θ / r | Electric blue / cyan | "This is an engineer." The field is computed, not drawn. |
| **Chrome** (`/chrome`) | 3D distorted chrome + liquid-metal wordmark | Platinum / warm bone | "This is a maker." The most visceral of the three. |
| **Energy** (`/energy`) | Rotor, poles, live power trace | Amber / teal | "This is power systems." The most specific. |

Implementation: a `data-variant` attribute on the page wrapper swaps six custom
properties — accent, accent-2, glow, and two field tints. No duplicated
components, no forked CSS.

## Why the flux variant is the default

It is the only one that makes a technical claim on his behalf. A dipole's field
lines are contours of an analytic stream function, so what you see is the actual
solution for a magnet — a fluid swirl would have been decoration. It also costs
the least to run and reads at every screen size, including on a phone where the
3D chrome is deliberately skipped.

## Palette

Chromatic darks, not "black with grey tints". Shared across variants:

| Token | Value | Role |
|---|---|---|
| `void` | `#04060e` | ground — carries indigo |
| `slate` | `#121a2f` | glass tint base |
| `shale` | `#1d2740` | rules and hairlines only, never text |
| `haze` | `#7b88a6` | secondary text (5.4:1 — passes AA) |
| `mist` | `#b6c2dc` | body text |
| `bone` | `#f3f0e7` | headings — warm, never pure white |

Per variant: `--accent`, `--accent-2`, `--glow`, and two field tints. The accent
is used for metrics, the quote rule and the mark's conic gradient — nowhere else.
Bolding every heading in the accent colour would flatten the hierarchy.

## Type

Two variable families, clearly distinct.

- **Bricolage Grotesque** — display. `font-stretch` at 96% for the hero, optical
  sizing on. Holds at 9.5rem and at 1.05rem.
- **Instrument Sans** — body. More character than Inter at small sizes.

No third family. No monospace: mono micro-labels are one of the clearest tells
of generated UI, and there is no numeric table here that needs one. Numbers use
tabular figures in the display face instead (`.metric`, `.tabular`).

## What was refused

The `frontend-design` skill lists the defaults that make a page read as
generated. Each was checked:

| Default | What this does instead |
|---|---|
| Warm cream + serif + terracotta | Chromatic indigo darks; terracotta appears nowhere |
| Near-black + one acid-green accent | No acid accent; colour comes from the field or the metal |
| ALL-CAPS tracked eyebrow over every heading | No eyebrows |
| `A · B · C` middle-dot meta strings | Separate lines, or a sentence |
| `WORD — fragment` labels | Plain sentences |
| `→` on every link | Links underline from the left on hover |
| `01 / 02 / 03` numbered markers | Removed from the capability list once I checked — those pillars are parallel, not sequential. Numbers survive only in the P6 stat blocks, where the data really is a set of counts. |
| Identical rounded cards, one shadow | Featured work is an asymmetric grid (one wide, four square); the remaining 21 are a two-column hairline list, not 21 more cards |
| Fade-and-slide-up on every section | One orchestrated hero reveal, then motion only where it answers scroll or press |

## Layout

Asymmetric, left-aligned, generous negative space. The About section pins the
portrait while the copy scrolls past it — a spatial cue that you are inside one
idea. The work catalogue is a list, not a grid of cards, because 21 items with
the same box is a wall.

## Motion

Motion either answers an action or communicates space.

- Hero: one orchestrated reveal (~1.2s), then it stops.
- Statement: words resolve on scroll — answering the visitor.
- Flight: scroll is a scrubber on a single camera spline. Velocity is smoothed
  (`p += (target - p) * 0.085`) so the camera inherits inertia.
- Press: `scale(0.97)` at 150ms, `--ease-out-quint`. Nothing else on controls.
- Custom easings only. `ease-in` appears nowhere; the CSS `ease` keyword is not
  used. `prefers-reduced-motion` gets a static frame, not a slowed animation.

## Accessibility

- Portraits have descriptive alt text; every decorative canvas is `aria-hidden`.
- Skip link, 3px `:focus-visible` rings at 3px offset.
- `aria-expanded` / `aria-controls` on every disclosure; `aria-pressed` on filters.
- `aria-live` on the copy-to-clipboard confirmation.
- Credentials are buttons with real `hidden` regions, so they work without JS.
- Body text meets AA on the darkest ground; `haze` is the floor at 5.4:1.
  `shale` is restricted to 1px rules and is never used for text.

## Performance

- One WebGL context per viewport, `IntersectionObserver`-gated and unmounted off
  screen. The 3D chrome scene is skipped entirely on coarse pointers.
- The chrome environment is baked once (`frames={1}`) — it never changes, so
  re-rendering it every frame would be waste.
- `dpr` capped at 1.75 (1.6 for 3D, 1.25 on coarse pointers).
- Static prerender. First-load JS: 189 kB (`/`), 191 kB (`/chrome`), 189 kB
  (`/energy`), 107 kB on `/cv`, `/work` and the case studies.
- `npm run budget` measures the built HTML — every script and stylesheet the
  browser is actually told to fetch, deduplicated per route and gzipped — and
  fails if any route crosses the limits in `scripts/check-budget.mjs`. It runs
  in the Pages workflow, before the artifact is uploaded, so a dependency that
  taxes every page cannot reach production quietly.
  - Today: 197 kB JS (budget 200), 13.5 kB CSS (32), 24.7 kB HTML (130).
  - `noModule` scripts are excluded: the polyfill bundle is a tax on browsers
    nobody reads this on.
  - The budgets are a ratchet at roughly today's numbers. Raising one is a
    one-line edit — the point is that it is a reviewed edit, not a discovery.
- Measurement: `@vercel/analytics` (production mode only, so preview aliases do
  not pollute the numbers) and `@vercel/speed-insights`, both gated on the
  build environment. They render on Vercel, where the `/_vercel/insights/*`
  scripts exist, and not on Pages, where they would 404.

## Known gaps

- Case studies exist at `/work/[slug]` for all 29 records (26 projects and the
  three P6 models), but only eight have long-form sections. The rest render
  the record itself — metric, description, caveat — because inventing a
  constraint and an approach for a build we have no material on would be
  fabrication dressed as depth. Give the owner's words and they fill in.
- The CV exists in two forms generated from one source (`content/cv.ts`):
  `/cv` for the screen and `public/cv/akinmade-faruq-adeoye-cv.pdf` for the
  file a recruiter attaches to an application. `npm run cv` regenerates the
  PDF after any content edit — nothing else in the repo can produce it, and
  a stale PDF is worse than none.
- No per-project OG images; one static `og.png` covers the whole site.
- Two Zenodo records were listed in the wrong order (PIDA and the Riemannian
  BCI paper) for one deployment. Caught by fetching both records instead of
  trusting the earlier website, which — unusually — had them right. The
  lesson held: identifiers are checked against the source, never against a
  previous rendering of the same mistake.
- Project links come in three kinds and all three are labelled: `Live demo`
  (Streamlit), `Code` (GitHub), `Zenodo` (the record). Every one was opened
  before it was written down; the demos are asleep on Streamlit's free tier
  and wake on first visit, which is expected rather than broken.
- `g.dev/Akinmade-Faruq` is deliberately absent. It redirects to
  `me.developers.google.com`, which asks a visitor to sign in — a profile link
  that shows a login wall is worse than no link.
- 19 of the 36 credentials still have no verification link. The other 17 do;
  the `verify` field renders only from a URL the issuer actually generated,
  because a verification link that fails to verify is worse than no link.
- Contact is copy-to-clipboard plus `tel:` and `mailto:` — no form, because a
  form needs a service and a spam answer before it is worth shipping.
- `@shadergradient/react` was evaluated and removed. It works (the library needs
  an `exports` alias to resolve under Next's `react-server` condition), but
  after the persona changed it added a third live WebGL context for a generic
  gradient plane. The two bespoke shaders do more, for less.
