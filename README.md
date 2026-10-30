# Portfolio

A portfolio for a design engineer, built around three real techniques rather than
three stock sections:

1. **Liquid-metal type** — the name is poured from a fragment shader. A height
   field, an analytic normal, a procedural studio environment, and per-channel
   reflection dispersion. No image textures but the glyph mask.
2. **A scroll-scrubbed flight** — one `CatmullRomCurve3`, one camera, scroll
   mapped to arc length. It never cuts because there is only one move.
3. **Liquid glass** — layered specular insets over a real `backdrop-filter`,
   with SVG displacement refraction where the browser supports it.

Behind those, next to nothing: a chromatic dark palette, two variable typefaces,
and motion that only ever answers the scroll or the press.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Three.js ·
React Three Fiber 9 · `@shadergradient/react` · Motion · Lenis.

## Make it yours

Everything you would want to change is in **`content/site.ts`** — name, role,
positioning line, about copy, capabilities, experience, projects, links. No
component edits needed.

Then replace the placeholder socials and email, and set a real `metadataBase` in
`app/layout.tsx`.

## Layout of the code

```
app/
  layout.tsx          fonts, nav, smooth scroll
  page.tsx            section order
  globals.css         tokens, type scale, liquid glass, motion primitives
content/site.ts       all copy, all data
components/
  hero/               liquid name (the shader) + the shadergradient field
  work/               the scroll flight + the project index
  sections/           statement, about, experience, contact, footer
  chrome/             nav, smooth scroll
lib/
  shaders/            GLSL — liquid metal
  utils.ts            cn, clamp, easings
.claude/skills/       162 vendored agent skills + a catalog of 1,144
docs/
  DESIGN.md           why it looks like this, and what was refused
  SKILLS.md           the skill library and how to use it
```

## The skills

48 repositories were cloned and read to build this. The useful output is checked
in: 162 skills vendored under `.claude/skills/` plus an index of all 1,144 found.
See [`docs/SKILLS.md`](docs/SKILLS.md).

The webgl/glass/flight playbook distilled from
[shadergradient](https://github.com/ruucm/shadergradient),
[liquid-logo](https://github.com/collidingScopes/liquid-logo),
[paper-design/liquid-logo](https://github.com/paper-design/liquid-logo),
[scroll-world](https://github.com/oso95/scroll-world),
[liquid-glass-js](https://github.com/dashersw/liquid-glass-js) and
[react-three-fiber](https://github.com/pmndrs/react-three-fiber) lives at
[`.claude/skills/realtime-webgl-surfaces`](.claude/skills/realtime-webgl-surfaces/SKILL.md).

> `paper-design/liquid-logo` is PolyForm Shield licensed. That project was studied
> for its model, not copied — the shader here is an independent implementation.

## Licence

The site code is yours to use. Vendored skills keep their own licences, recorded
in each folder.
