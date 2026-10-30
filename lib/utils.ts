import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Clamp helper used by the scroll engine. */
export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v))
}

/** Map a value from one range to another, clamped. */
export function mapRange(v: number, a: number, b: number, c = 0, d = 1) {
  return clamp((v - a) / (b - a)) * (d - c) + c
}

export const EASE = {
  outQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  inOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
}
