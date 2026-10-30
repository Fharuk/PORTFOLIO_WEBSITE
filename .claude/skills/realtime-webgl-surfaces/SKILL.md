---
name: realtime-webgl-surfaces
description: Build and review real-time browser surfaces — animated shader gradients, liquid-metal type, refractive glass, and scroll-scrubbed 3D camera flights. Use when a page needs a WebGL layer, a chrome/molten material, glass that bends the page behind it, or a scroll-driven camera that must not cut. Covers the technique, the licensing traps, and the performance budget.
---

# Real-time WebGL surfaces

Distilled from six repositories studied for this project. Read the "licensing"
section before copying anything.

## The sources, and what each one actually teaches

| Source | What is worth taking | What to leave |
|---|---|---|
| `ruucm/shadergradient` | The `ShaderGradient`/`ShaderGradientCanvas` pair, a `cDistance`/`cPolarAngle` camera model over a noise-driven plane, and a full query-string-driven preset system | The store + UI layer; v2 splits it out for a reason |
| `collidingScopes/liquid-logo` | Iterative plasma/feedback in a fragment shader, and a preset table (`Glow`, `Wisp`, `Smoke`) of named parameter sets | It is a *plasma*, not a metal — no reflected environment |
| `paper-design/liquid-logo` | The stripe + bulge + per-channel refraction model that makes chrome read as chrome. **Licence: PolyForm Shield — do not copy the code.** | Everything, code-wise. Take the model, write the shader. |
| `oso95/scroll-world` | Scroll-scrubbed camera flights, the "seam rule" (consecutive scenes must be frame-identical at the join), a portable scrub engine | The paid Monid/Higgsfield video pipeline |
| `dashersw/liquid-glass-js` | Layered specular insets, nested glass sampling, shape variants | `html2canvas` page sampling — expensive and wrong once content scrolls |
| `pmndrs/react-three-fiber` | Declarative scene graph, `useFrame`, and the v9/React 19 pairing | — |

## Version reality check

Next 15 App Router forces React 19, which forces **R3F v9**. R3F v8 is
structurally incompatible with the App Router's vendored React. `three` must be
`>=0.158`. Get this wrong and you get a blank canvas with no error.

`@shadergradient/react` publishes an `exports` map with only an `import`
condition. Next resolves the server graph with `react-server`, which is not
listed, so the bare specifier fails with *"Package path . is not exported"*.
Alias it rather than patching `node_modules`:

```ts
// next.config.ts
config.resolve.alias['@shadergradient/react$'] = path.resolve(
  process.cwd(), 'node_modules/@shadergradient/react/dist/index.mjs')
```

## Liquid metal, from first principles

A gradient is not metal. Metal is a **height field that reflects an
environment**. Four steps, in this order:

1. **Height** — warped fbm noise, plus a lens bulge toward the centre, plus a
   rim bevel taken from the *gradient of the glyph mask* (`texture(uv + texel) -
   texture(uv - texel)`). The bevel is what makes letters look poured instead of
   printed. Do not skip it.
2. **Normal** — the analytic gradient of that height. Finite differences on the
   noise are fine; finite differences on the *mask* are not, sample the texture.
3. **Environment** — never a texture. Describe a light rig in maths: a floor
   bounce, a dark ceiling, a hard horizon strip, two cool softboxes, one warm
   source. Reflect the view vector into it. One warm source is what stops chrome
   reading as blue-grey plastic.
4. **Dispersion** — reflect R, G and B along *slightly different* normals
   (`normalize(r ± n * 0.05)`). This is the entire difference between "chrome"
   and "a gradient with a highlight".

Then: tonally compress with `c / (1 + c * 0.62)` so highlights do not clip to
flat white, and multiply by mask coverage for the alpha.

## Glass that refracts the real page

The cheap, correct stack, in order of what you can afford:

1. `backdrop-filter: blur(18px) saturate(165%) brightness(1.08)` — real content,
   real refraction of *colour*, almost free.
2. Four inset `box-shadow`s at 1px — top brightest, bottom faintest. This single
   detail is what makes a panel read as glass rather than frosted plastic.
3. A `::before` with `padding: 1px` + `mask-composite: exclude` for a gradient
   rim that catches light at the top edge.
4. `@supports (backdrop-filter: url(#f))` → a `feTurbulence` + `feDisplacementMap`
   filter inside `backdrop-filter`. Chromium only. Progressive enhancement, never
   a dependency.

Never sample the page with `html2canvas`. It is slow, it is stale the moment
anything scrolls, and it breaks on cross-origin content.

## Scroll-scrubbed flights

The seam rule: **scroll only drives time; the camera does the moving.** Two
implementations:

- *Video chain* (scroll-world): pre-render one clip per scene and one connector
  per join, generated frame-locked against its neighbour's last frame. Heavier,
  photoreal, costs money.
- *Procedural* (what this repo does): one `CatmullRomCurve3`, one camera,
  `curve.getPointAt(progress)`, look at `getPointAt(progress + 0.03)`. There are
  no cuts because there is only one continuous move. Free, and it never pops.

Rules that matter either way:

- Smooth progress toward the real scroll value (`p += (target - p) * 0.085`) so
  the camera inherits inertia instead of snapping between scroll events.
- Never `play()` — always seek to a position.
- Fog is not decoration: it hides the draw distance and gives the move depth.
- Give the eye something to pass *through* (portals, ring gates). Passing through
  geometry is what sells forward motion.

## Budget

- Cap `dpr` at `[1, 1.75]`. Retina full-res is never worth it here.
- One WebGL context per *visible* region. Three live contexts will drop frames on
  a laptop — gate each canvas behind an `IntersectionObserver` and unmount it
  when it leaves view.
- Pause on `document.visibilityState !== 'visible'`.
- `prefers-reduced-motion` gets a static poster, not a slower animation.
- Always paint a CSS fallback underneath. The shader is an enhancement; the page
  must look intentional with WebGL disabled entirely.

## Review checklist

- [ ] Does it degrade with WebGL off?
- [ ] Is the canvas `aria-hidden`, with the real text in the DOM?
- [ ] Does every animation run on the compositor (`transform`/`opacity`)?
- [ ] Is there a reduced-motion path that is *static*, not slowed?
- [ ] Is progress read from state when it is rendered, and from a ref when it is
      only fed to the GPU? (Reading a ref in render freezes the value at 0.)
- [ ] Are fonts resolved (`document.fonts.ready`) before baking a mask texture?
- [ ] Does the material still read at 320px wide?

## Licensing

`ruucm/shadergradient`, `collidingScopes/liquid-logo`, `dashersw/liquid-glass-js`,
`pmndrs/react-three-fiber` and `oso95/scroll-world` are MIT — safe to vendor.

`paper-design/liquid-logo` is **PolyForm Shield 1.0.0**. It is source-available,
not open source, and it forbids competing use. Study the model; write your own
shader. The liquid-metal shader in `lib/shaders/` is an independent
implementation for exactly this reason.
