/**
 * Liquid metal.
 *
 * Written from scratch after studying the approaches in paper-design/liquid-logo
 * and collidingScopes/liquid-logo. Neither is vendored: the former is PolyForm
 * Shield, and the latter is a plasma effect rather than a metal. What is shared
 * is the *idea* — a bulge field plus a stripe pattern plus per-channel
 * refraction. What is original here is the lighting model.
 *
 * The surface is treated as a real height field:
 *   1. height  = warped fbm noise + a lens bulge + a rim bevel lifted from the
 *                gradient of the glyph mask (this is what makes the letters look
 *                poured rather than printed).
 *   2. normal  = analytic gradient of that height.
 *   3. colour  = a procedural studio environment, reflected.
 *   4. the three channels reflect along *slightly different* vectors, which is
 *      where the chromatic dispersion comes from. That is the whole trick, and
 *      it is why the result reads as chrome instead of as a gradient.
 */

export const vertexShader = /* glsl */ `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vUv;
void main() {
  vUv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

export const fragmentShader = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uMask;
uniform vec2  uResolution;
uniform vec2  uPointer;   // -1..1, eased
uniform float uTime;
uniform float uProgress;  // 0..1 load reveal
uniform float uAspect;

#define PI 3.14159265359

/* ---- value noise ------------------------------------------------------ */
float hash(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.03;
    a *= 0.5;
  }
  return v;
}

/* ---- procedural studio environment ------------------------------------ */
/* Not a texture: a light rig described in maths. Reflect a direction, get
   a colour. Two cool softboxes, one warm, a bone floor bounce, dark ceiling. */
vec3 env(vec3 r) {
  float y = clamp(r.y * 0.5 + 0.5, 0.0, 1.0);

  vec3 ceiling = vec3(0.035, 0.045, 0.070);
  vec3 horizon = vec3(0.10, 0.13, 0.22);
  vec3 floor_  = vec3(0.86, 0.84, 0.78);

  vec3 c = mix(floor_, horizon, smoothstep(0.18, 0.56, y));
  c = mix(c, ceiling, smoothstep(0.62, 1.0, y));

  // and the horizon band behaves like a hard light strip on real chrome
  c += vec3(0.34, 0.40, 0.52) * smoothstep(0.30, 0.0, abs(y - 0.62));

  float az = atan(r.z, r.x);

  // cool key softbox
  float key = smoothstep(0.35, 0.95, cos(az + 1.9)) * smoothstep(-0.15, 0.75, r.y);
  c += key * vec3(0.62, 0.78, 1.05);

  // cyan fill, lower and to the other side
  float fill = smoothstep(0.55, 0.98, cos(az - 2.6)) * smoothstep(0.55, -0.25, r.y);
  c += fill * vec3(0.10, 0.38, 0.52);

  // warm bounce — the one warm source, so the chrome never reads as blue-grey plastic
  float warm = smoothstep(0.60, 0.98, cos(az - 0.55)) * smoothstep(-0.65, 0.25, -r.y);
  c += warm * vec3(0.58, 0.34, 0.14);

  // fine specular pinpoints: a real studio has small hot sources too
  c += pow(max(0.0, cos(az * 2.0 + 0.8)), 26.0) * 0.25 * smoothstep(0.0, 0.6, r.y);

  return c;
}

void main() {
  vec2 uv = vUv;
  vec2 auv = (uv - 0.5) * vec2(uAspect, 1.0);

  /* ---- glyph coverage ------------------------------------------------ */
  vec4 m = texture(uMask, uv);
  float cover = smoothstep(0.02, 0.72, m.r);

  // rim bevel from the mask gradient — cheap and it sells the material
  vec2 texel = 1.0 / vec2(textureSize(uMask, 0));
  float mx = texture(uMask, uv + vec2(texel.x, 0.0)).r - texture(uMask, uv - vec2(texel.x, 0.0)).r;
  float my = texture(uMask, uv + vec2(0.0, texel.y)).r - texture(uMask, uv - vec2(0.0, 0.0)).r;
  vec2 bevel = vec2(mx, my);

  /* ---- height field -------------------------------------------------- */
  float t = uTime * 0.16;

  // slow drifting warp, so the metal reads as viscous rather than solid
  vec2 warp = vec2(
    fbm(auv * 1.6 + vec2(t * 0.9, -t * 0.6)),
    fbm(auv * 1.6 + vec2(-t * 0.7, t * 0.8) + 11.3)
  );
  vec2 q = auv * 2.3 + (warp - 0.5) * 1.15;

  float h = fbm(q + vec2(0.0, t * 1.1)) * 0.55;

  // lens bulge: metal is domed toward the viewer in the centre
  float bulge = 1.0 - smoothstep(0.0, 0.95, length(auv * vec2(0.9, 1.25)));
  h += bulge * 0.42;

  // pointer pulls a ripple through the surface — feedback, not decoration
  float d = length(auv - uPointer * vec2(0.34, 0.20));
  h += 0.16 * exp(-d * 5.5) * sin(d * 16.0 - uTime * 1.4);

  // rim bevel drives the letters' rounded edges
  h += (bevel.x + bevel.y) * 2.4;

  /* ---- normal -------------------------------------------------------- */
  float e = 0.0035;
  float hx = fbm(q + vec2(e, 0.0) + vec2(0.0, t * 1.1)) * 0.55;
  float hy = fbm(q + vec2(0.0, e) + vec2(0.0, t * 1.1)) * 0.55;
  float dx = (hx - (fbm(q + vec2(0.0, t * 1.1)) * 0.55)) / e;
  float dy = (hy - (fbm(q + vec2(0.0, t * 1.1)) * 0.55)) / e;

  float strength = 0.030;
  vec3 n = normalize(vec3(-dx * strength - bevel.x * 9.0, -dy * strength - bevel.y * 9.0, 1.0));

  vec3 v = vec3(0.0, 0.0, 1.0);
  vec3 r = reflect(-v, n);

  /* ---- chromatic dispersion ------------------------------------------ */
  /* The whole reason this reads as chrome. Each channel reflects off a
     marginally different surface normal. */
  float disp = 0.055 + 0.05 * bulge;
  vec3 rr = normalize(r + n * disp);
  vec3 rg = r;
  vec3 rb = normalize(r - n * disp);

  vec3 col;
  col.r = env(rr).r;
  col.g = env(rg).g;
  col.b = env(rb).b;

  // grazing angles pick up an icy sheen, like real polished aluminium
  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0);
  col += fres * vec3(0.30, 0.38, 0.55);

  // contact shadow where the bevel faces away, so letters sit in the page
  col *= 1.0 - 0.35 * smoothstep(0.0, 0.4, -bevel.y);

  // tonal compression keeps the highlights from clipping to flat white
  col = col / (1.0 + col * 0.62);
  col = pow(col, vec3(0.92));

  /* ---- load reveal: metal fills the letters from the bottom ----------- */
  float fill = smoothstep(0.0, 1.0, (uProgress * 1.35) - uv.y * 0.35);
  float edge = smoothstep(fill - 0.04, fill + 0.02, uv.y * 0.35 + 0.35 - fill);
  cover *= step(uv.y * 0.35 + 0.35, fill + 0.02);

  // a hot line at the filling edge
  col += vec3(1.0, 0.96, 0.88) * smoothstep(0.02, 0.0, abs(uv.y * 0.35 + 0.35 - fill)) * (1.0 - uProgress);

  float alpha = cover;
  fragColor = vec4(col * alpha, alpha);
}`
