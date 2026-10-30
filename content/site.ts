/**
 * Single source of truth for every word on the site.
 * Edit this file to make the portfolio yours — no component changes needed.
 *
 * Anything marked TODO is a placeholder I could not infer. Give me the real
 * values and I will swap them in.
 */

export type Project = {
  slug: string
  title: string
  year: string
  role: string
  summary: string
  detail: string
  stack: string[]
  href?: string
  /** Rendered as the 3D slab in the scroll flight. */
  rgb: [number, number, number]
}

export type Role = {
  period: string
  company: string
  title: string
  summary: string
}

export const site = {
  // TODO: confirm the name + spelling.
  name: 'Faruk',
  fullName: 'Faruk Adeyemi',
  role: 'Design Engineer',
  location: 'Lagos, Nigeria',
  timezone: 'WAT · UTC+1',
  available: true,

  // The one line that does the work of the whole page.
  positioning:
    'I build interfaces where the rendering is the product — real-time shaders, physical motion, and type that holds its shape under pressure.',

  about: [
    'I work at the seam between design and the graphics pipeline. Most of what I make is a WebGL surface that has to stay at sixty frames while someone drags it, a layout that survives a forty-character job title, or a transition that can be grabbed mid-flight.',
    'That means writing the shader, not just specifying it — and it means caring just as much about the third tab stop as the first impression.',
  ],

  // TODO: replace with your own capabilities.
  capabilities: [
    {
      title: 'Real-time graphics',
      body: 'GLSL, WebGL2, Three.js and React Three Fiber. Custom materials, post-processing, and scroll-linked camera work.',
      items: ['GLSL / WGSL', 'Three.js', 'React Three Fiber', 'Shader authoring'],
    },
    {
      title: 'Interface engineering',
      body: 'React and Next.js with a bias toward the composite-only path: springs over keyframes, transform over layout, interruptible over scripted.',
      items: ['React 19', 'Next.js', 'TypeScript', 'Motion'],
    },
    {
      title: 'Design systems',
      body: 'Token architecture that survives contact with a real product team. Accessible contrast, real focus states, honest empty states.',
      items: ['Tailwind v4', 'Radix / Base UI', 'Figma', 'A11y'],
    },
    {
      title: 'Performance',
      body: 'Frame budgets, bundle discipline, and the unglamorous work of making a heavy page feel light.',
      items: ['Core Web Vitals', 'RSC', 'Bundle analysis', 'Profiling'],
    },
  ],

  // TODO: replace with real roles.
  experience: [
    {
      period: '2023 — now',
      company: 'Independent',
      title: 'Design Engineer',
      summary:
        'Partnering with product teams on rendering-heavy interfaces. Shipped design systems and interactive marketing sites.',
    },
    {
      period: '2021 — 2023',
      company: 'Placeholder Studio',
      title: 'Frontend Engineer',
      summary:
        'Owned the component layer of a multi-brand design system. Cut initial JS on the marketing surface by half.',
    },
    {
      period: '2019 — 2021',
      company: 'Placeholder Agency',
      title: 'Frontend Developer',
      summary:
        'Built award-adjacent campaign sites. Learned that the deadline is part of the design constraint.',
    },
  ] as Role[],

  projects: [
    {
      slug: 'liquid-metal',
      title: 'Liquid Metal',
      year: '2025',
      role: 'Shader, type, interaction',
      summary:
        'A real-time chrome typeface that refracts the page behind it, in one fragment shader with no textures but the mask.',
      detail:
        'Height-field normals drive a procedural studio environment. RGB are reflected down slightly different directions, which is where the dispersion comes from.',
      stack: ['GLSL', 'WebGL2', 'Canvas 2D'],
      rgb: [0.55, 0.68, 0.95],
    },
    {
      slug: 'flight',
      title: 'Continuous Flight',
      year: '2025',
      role: 'Concept, camera, build',
      summary:
        'A scroll-scrubbed camera that never cuts — it flies from outside each project into its interior and out the other side.',
      detail:
        'One spline, one camera, one render loop. Scroll position is mapped to arc-length, then eased, so the motion stays honest at any scroll velocity.',
      stack: ['React Three Fiber', 'Three.js', 'Lenis'],
      rgb: [0.95, 0.72, 0.55],
    },
    {
      slug: 'glass',
      title: 'Refractive Chrome',
      year: '2024',
      role: 'Design system',
      summary:
        'A liquid-glass surface language built from layered speculars and one SVG displacement pass, at a fraction of the usual cost.',
      detail:
        'The usual approach samples the page with html2canvas. This reads the real backdrop instead, so it stays correct when content scrolls underneath.',
      stack: ['CSS', 'SVG filters', 'Next.js'],
      rgb: [0.72, 0.92, 0.66],
    },
    {
      slug: 'atlas',
      title: 'Atlas',
      year: '2024',
      role: 'Design system, build',
      summary:
        'A 240-component design system with a token pipeline that compiles to CSS, Swift and Compose from one source.',
      detail:
        'Semantic tokens resolve at build time, so runtime theme switching never touches a stylesheet.',
      stack: ['TypeScript', 'Tailwind v4', 'Style Dictionary'],
      rgb: [0.88, 0.78, 0.98],
    },
  ] as Project[],

  // TODO: add your own.
  socials: [
    { label: 'GitHub', href: 'https://github.com/Fharuk' },
    { label: 'Email', href: 'mailto:hello@example.com' },
  ],

  email: 'hello@example.com',
}

/** Scenes the scroll camera visits. Order matters — it is one continuous flight. */
export const scenes = [
  { key: 'threshold', label: 'Approach', caption: 'Start outside the work.' },
  { key: 'surface', label: 'Surface', caption: 'The material comes into focus.' },
  { key: 'interior', label: 'Interior', caption: 'Inside the render.' },
  { key: 'convergence', label: 'Convergence', caption: 'Everything resolves at one point.' },
  { key: 'exit', label: 'Exit', caption: 'Out the far side, into the index.' },
] as const
