import type { RGB } from './elevation-color'

/**
 * Map a gradient percentage to a color.
 * Green (flat) → Yellow (moderate) → Red (steep).
 */
export function gradientToColor(gradientPercent: number): RGB {
  const absGrade = Math.min(Math.abs(gradientPercent), 50)
  const t = absGrade / 50 // 0 = flat, 1 = very steep

  if (t < 0.3) {
    // Green → yellow-green
    const s = t / 0.3
    return { r: s * 0.8, g: 0.8, b: 0.1 }
  } else if (t < 0.6) {
    // Yellow-green → orange
    const s = (t - 0.3) / 0.3
    return { r: 0.8 + s * 0.2, g: 0.8 - s * 0.4, b: 0.1 }
  } else {
    // Orange → red
    const s = (t - 0.6) / 0.4
    return { r: 1.0, g: 0.4 - s * 0.35, b: 0.1 }
  }
}
