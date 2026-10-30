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
