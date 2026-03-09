const FREE_TIER_LIMIT = 200_000

/**
 * Tracks Mapbox API tile requests to monitor free tier usage.
 */
export class MapboxRequestCounter {
  private count = 0

  getCount(): number {
    return this.count
  }

  increment(amount = 1): void {
    this.count += amount
  }

  reset(): void {
    this.count = 0
  }

  getPercentUsed(): number {
    return (this.count / FREE_TIER_LIMIT) * 100
  }

  getDisplayCount(): string {
    return this.count.toLocaleString('en-US')
  }

  getLimit(): number {
    return FREE_TIER_LIMIT
  }
}

// Singleton instance shared across the app
export const mapboxCounter = new MapboxRequestCounter()
