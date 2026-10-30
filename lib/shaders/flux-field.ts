/**
 * Variant A — flux.
 *
 * A real dipole. The field lines are contours of the stream function
 * ψ = sin θ / r, which is the analytic solution for a point dipole — so the
 * geometry on screen is the geometry of a magnet, not a decorative swirl.
 * Phase-shifting the contour offset makes flux appear to travel along the
 * lines, which is exactly what a changing field looks like.
 */
export const fluxFragment = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uPointer;
uniform float uScroll;

#define PI 3.14159265359

/** Stream function of a dipole at the origin, axis rotated by a. */
float dipolePsi(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  vec2 q = mat2(c, -s, s, c) * p;
  q.y += 0.0001;
  float r = max(length(q), 0.055);
  float th = atan(q.y, q.x);
  return sin(th) / r;
}

/** Thin contour band around an integer of v. */
float contour(float v, float width) {
  float f = fract(v);
  float d = min(f, 1.0 - f);
  return 1.0 - smoothstep(0.0, width, d);
}

void main() {
  vec2 res = uResolution;
  float aspect = res.x / res.y;
  vec2 uv = vUv;
  vec2 p = (uv - vec2(0.5)) * vec2(aspect, 1.0);

  // a slow drift, so the field is alive without ever being busy
  p += uPointer * vec2(0.045, 0.03);

  float t = uTime * 0.22;
  float s = uScroll;

  // --- two dipoles, one dominant, one opposing -------------------------
  vec2 c1 = vec2(-0.16 * aspect, 0.02);
  vec2 c2 = vec2( 0.20 * aspect, -0.06);
  vec2 d1 = p - c1;
  vec2 d2 = p - c2;

  float psi1 = dipolePsi(d1, 0.06 + sin(t * 0.18) * 0.10);
  float psi2 = dipolePsi(d2, PI * 0.52);

  // contour density falls off with radius; that is what a field does
  float lines1 = contour(psi1 * 2.1 - t, 0.055);
  float lines2 = contour(psi2 * 1.7 + t * 0.8, 0.045);

  // field strength, for the glow at the poles
  float r1 = length(d1), r2 = length(d2);
  float g1 = 0.028 / max(r1 * r1, 0.0025);
  float g2 = 0.020 / max(r2 * r2, 0.0025);

  // --- technical grid --------------------------------------------------
  vec2 g = uv * vec2(aspect, 1.0) * 34.0 + vec2(0.0, s * 2.0);
  vec2 gf = abs(fract(g) - 0.5);
  float grid = (1.0 - smoothstep(0.0, 0.02, gf.x)) + (1.0 - smoothstep(0.0, 0.02, gf.y));
  grid *= 0.05;

  // --- compose ---------------------------------------------------------
  vec3 base = vec3(0.016, 0.024, 0.055);
  base = mix(base, vec3(0.028, 0.040, 0.095), smoothstep(1.15, 0.0, length(p)));

  vec3 cool = vec3(0.43, 0.66, 1.00);
  vec3 teal = vec3(0.35, 0.84, 0.90);

  vec3 col = base;
  col += cool * lines1 * (0.55 + 0.45 * smoothstep(0.0, 0.55, r1 * 0.6)) * 0.95;
  col += teal * lines2 * 0.55;
  col += cool * clamp(g1, 0.0, 1.2) * 0.55;
  col += teal * clamp(g2, 0.0, 1.0) * 0.35;
  col += vec3(0.32, 0.44, 0.7) * grid;

  // the poles themselves
  col += cool * smoothstep(0.016, 0.0, r1) * 1.4;
  col += teal * smoothstep(0.012, 0.0, r2) * 1.0;

  // vignette so the type always has a floor to sit on
  float vig = smoothstep(1.35, 0.15, length((uv - vec2(0.5, 0.46)) * vec2(1.15, 1.0)));
  col *= mix(0.42, 1.0, vig);
  // lift the bottom-left falloff where the headline sits
  col *= mix(0.55, 1.0, smoothstep(0.0, 0.65, uv.y));

  col = col / (1.0 + col * 0.5);
  fragColor = vec4(col, 1.0);
}`
