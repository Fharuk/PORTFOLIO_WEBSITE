/**
 * Variant C — energy.
 *
 * The visual language of a machine under load: concentric field rings around a
 * rotor, rotating pole segments, and a live power waveform crossing the frame.
 * Rings are evenly spaced in radius (not in p — that is what makes an
 * oscilloscope graticule read as an instrument), and the waveform is a real
 * sum of harmonics rather than noise.
 */
export const energyFragment = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uPointer;
uniform float uScroll;

#define PI 3.14159265359
#define TAU 6.28318530718

float ringBand(float r, float spacing, float phase, float width) {
  float v = r / spacing + phase;
  float f = fract(v);
  float d = min(f, 1.0 - f);
  return 1.0 - smoothstep(0.0, width, d);
}

void main() {
  vec2 res = uResolution;
  float aspect = res.x / res.y;
  vec2 uv = vUv;
  vec2 p = (uv - vec2(0.5)) * vec2(aspect, 1.0);

  p += uPointer * vec2(0.03, 0.02);

  float t = uTime;
  float r = length(p);
  float ang = atan(p.y, p.x);

  // --- rotor ------------------------------------------------------------
  // rings breathe outward; the pole segments counter-rotate
  float rings = ringBand(r, 0.085, -t * 0.05, 0.055) * smoothstep(1.25, 0.05, r);
  float inner = ringBand(r, 0.032, -t * 0.08, 0.09) * smoothstep(0.42, 0.02, r);

  // 6 poles, counter-rotating against the rings
  float poles = smoothstep(0.62, 0.98, cos(ang * 6.0 + t * 0.35));
  poles *= smoothstep(0.10, 0.30, r) * smoothstep(1.05, 0.42, r);

  // residue from the poles: faint arcs
  float arcs = smoothstep(0.5, 1.0, cos(ang * 12.0 - t * 0.22)) * smoothstep(0.95, 0.15, r);

  // --- power waveform ---------------------------------------------------
  // three harmonics, so the trace looks measured rather than drawn
  float waveY = 0.0;
  waveY += sin(uv.x * 11.0 + t * 1.1) * 0.030;
  waveY += sin(uv.x * 23.0 - t * 1.7) * 0.013;
  waveY += sin(uv.x * 47.0 + t * 2.3) * 0.005;

  float wy = 0.30 + waveY + uScroll * -0.12;
  float trace = 1.0 - smoothstep(0.0, 0.0028, abs(uv.y - wy));
  float halo = 1.0 - smoothstep(0.0, 0.045, abs(uv.y - wy));

  // a second, quieter trace
  float wy2 = 0.19 + sin(uv.x * 7.0 - t * 0.7) * 0.018 + uScroll * -0.06;
  float trace2 = 1.0 - smoothstep(0.0, 0.0022, abs(uv.y - wy2));

  // --- graticule --------------------------------------------------------
  vec2 g = uv * vec2(aspect, 1.0) * vec2(28.0, 18.0);
  vec2 gf = abs(fract(g) - 0.5);
  float grid = (1.0 - smoothstep(0.0, 0.018, gf.x)) + (1.0 - smoothstep(0.0, 0.018, gf.y));
  grid *= 0.045;

  // --- colour -----------------------------------------------------------
  vec3 base = vec3(0.020, 0.014, 0.010);
  base = mix(base, vec3(0.045, 0.030, 0.018), smoothstep(1.3, 0.0, r));

  vec3 amber = vec3(1.00, 0.71, 0.40);
  vec3 teal  = vec3(0.31, 0.82, 0.69);

  vec3 col = base;
  col += amber * rings * 0.55;
  col += amber * inner * 0.85;
  col += teal * poles * 0.28;
  col += teal * arcs * 0.20;
  col += amber * trace * 1.25;
  col += amber * halo * 0.10;
  col += teal * trace2 * 0.55;
  col += vec3(0.5, 0.42, 0.34) * grid;

  // hot core
  col += amber * smoothstep(0.075, 0.0, r) * 1.15;
  col += vec3(1.0, 0.94, 0.84) * smoothstep(0.018, 0.0, r) * 1.6;

  float vig = smoothstep(1.45, 0.2, length((uv - vec2(0.5, 0.5)) * vec2(1.2, 1.0)));
  col *= mix(0.38, 1.0, vig);
  col *= mix(0.5, 1.0, smoothstep(0.0, 0.6, uv.y));

  col = col / (1.0 + col * 0.55);
  fragColor = vec4(col, 1.0);
}`
