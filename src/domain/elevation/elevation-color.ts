export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Map an elevation value to a natural terrain color.
 * Low = green (forest), mid = brown (earth), high = white (snow).
 */
export function elevationToColor(elevation: number, minElev: number, maxElev: number): RGB {
  const range = maxElev - minElev
  const t = range > 0 ? Math.max(0, Math.min(1, (elevation - minElev) / range)) : 0

  if (t < 0.3) {
    // Green (forest) → darker green
    const s = t / 0.3
    return {
      r: 0.15 + s * 0.2,
      g: 0.4 + s * 0.15,
      b: 0.1 + s * 0.05,
    }
  } else if (t < 0.6) {
    // Brown/tan (earth, rock)
    const s = (t - 0.3) / 0.3
    return {
      r: 0.35 + s * 0.25,
      g: 0.55 - s * 0.1,
      b: 0.15 + s * 0.1,
    }
  } else if (t < 0.85) {
    // Gray (rock)
    const s = (t - 0.6) / 0.25
    return {
      r: 0.6 + s * 0.15,
      g: 0.45 + s * 0.2,
      b: 0.25 + s * 0.35,
    }
  } else {
    // White (snow)
    const s = (t - 0.85) / 0.15
    return {
      r: 0.75 + s * 0.25,
      g: 0.65 + s * 0.35,
      b: 0.6 + s * 0.4,
    }
  }
}
