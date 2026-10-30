# Design decisions

A record of what was chosen and what was deliberately refused, so the next
person (or the next agent) extends the system instead of fighting it.

## The brief I designed against

Subject: a design engineer whose work *is* the render — real-time graphics,
interface engineering, the frame budget in between. Audience: people hiring for
exactly that, who look at a portfolio the way a mechanic listens to an engine.

The page had to be undeniable evidence of the skill, not a description of it.
So the hero is a live shader, and the scrolling is a camera move.

## Palette

Chromatic darks, not "black with grey tints".

| Token | Value | Role |
|---|---|---|
| `void` | `#04060e` | page ground — carries indigo, not neutral |
| `abyss` | `#080d1b` | raised surfaces |
| `slate` | `#121a2f` | glass tint base |
| `shale` | `#1d2740` | rules and hairlines |
| `haze` | `#7b88a6` | secondary text (5.4:1 on void — passes AA) |
| `mist` | `#b6c2dc` | primary body text |
| `bone` | `#f3f0e7` | headings, highlights — warm, never pure white |
| `focus` | `#8ab4ff` | focus ring only |

**There is no flat accent colour.** The accent is the liquid metal, which is a
moving iridescent gradient. That is a choice with a cost — it means nothing static
can "match" it — and the payoff is that no single hue on the page reads as a
default.

## Type

Two families, clearly distinct, both variable.

- **Bricolage Grotesque** — display. Engineered, slightly irregular, holds up at
  9rem and at 1.25rem. `font-stretch` is used rather than a second family to get
  width contrast; the `.display` class runs it at 96%.
- **Instrument Sans** — body. More character than Inter at small sizes without
  becoming a distraction.

No third family. No monospace — monospace micro-labels are one of the clearest
tells of generated UI, and nothing here is a numeric table.

Scale follows *The Elements of Typographic Style*: 1.28 ratio, wider steps for
display, measure capped at 66ch.

## What was refused, and why

The `frontend-design` skill lists the specific defaults that make a page read as
generated. Each one was checked and avoided:

| Default | What this page does instead |
|---|---|
| Warm cream + serif + terracotta accent | Chromatic indigo dark, no terracotta anywhere |
| Near-black with one acid-green accent | No flat acid accent; iridescence comes from the shader |
| Tracked-out ALL-CAPS eyebrow above every heading | Headings are headings. No eyebrows at all. |
| `A · B · C` meta strings with middle dots | Location and role are separate lines, or a full sentence |
| `WORD — fragment` labels | Plain sentences |
| `→` appended to every link | Links underline from the left on hover; state, not ornament |
| `01 / 02 / 03` numbered markers | Used **nowhere**, because no content here is a real sequence — except the flight stations, which are shown as a progress rail, not as numerals |
| Identical rounded cards, one radius, one shadow | Project rows with hairline rules and a 4% colour tint; one radius per element class, chosen per element |
| Fade-and-slide-up on every section | One orchestrated page-load in the hero, then motion only where it answers the scroll or a press |
| Meta strings in monospace | Instrument Sans with tabular numerals |

## Layout

Asymmetric 12-column frame, content left-aligned, generous negative space. The
hero is bottom-weighted on purpose: the fixed nav floats over empty field, and
the chrome word sits low, so the page reads as a viewport onto something larger
rather than a centred poster.

Sections alternate between full-grid text and pinned two-column layouts. The
About block's heading sticks while its body scrolls — a small spatial cue that
you are inside one idea, not passing through two.

## Motion

One rule: **motion either answers an action or communicates space.** Nothing else.

- Hero load: a single orchestrated reveal, ~1.2s, then it stops.
- Statement: words resolve as the section crosses the viewport — scroll-driven,
  so it is answering you.
- Flight: scroll is a scrubber, not a slideshow trigger.
- Press feedback on every control: `scale(0.97)` at 150ms, `--ease-out-quint`.
- Hover colour transitions at 200–300ms with custom cubic-beziers; the CSS
  `ease` keyword was not used anywhere. `ease-in` appears nowhere.
- `prefers-reduced-motion` gets a **static** poster and no scrub — not a slower
  version of the same animation.

## Performance

- `dpr` capped at 1.75 (`1.25` on coarse pointers).
- Each canvas is gated behind an `IntersectionObserver` and unmounted when it
  leaves view, so at most one WebGL context is ever live.
- Hero shader is mounted only while the hero is on screen.
- The 3D flight is a separate `dynamic()` chunk; it never blocks first paint.
- Production build: **167 kB first-load JS**, static prerender, no server work.
- Every canvas has a CSS fallback painted underneath it.

## Accessibility

- The chrome word is `aria-hidden` canvas; the real `<h1>` is in the DOM.
- Skip link, visible `:focus-visible` rings at 3px offset, `aria-expanded` on
  every disclosure, `aria-labelledby` on every section.
- Body text meets AA on the darkest ground; `haze` is the floor at 5.4:1.
- `aria-live` on the copy-to-clipboard confirmation.
- Escape closes the mobile sheet; body scroll locks while it is open.
- Interactive targets are ≥40px on touch.

## Known gaps

- Content in `content/site.ts` is placeholder — persona, roles, project names
  and contact details all need replacing.
- No case-study routes yet; rows expand in place.
- No OG image, favicon, or `sitemap.ts`.
- No form — contact is a clipboard copy plus `mailto`. A form needs a service and
  a spam answer before it is worth shipping.
