import type { GPXRoute } from '../../domain/gpx/gpx-parser'

export interface RouteStore {
  getAll(): GPXRoute[]
  save(route: GPXRoute): void
  deleteByIndex(index: number): void
  clear(): void
}

/**
 * In-memory route store stub. Falls back for offline dev/testing.
 * Real implementation uses localStorage.
 */
export class InMemoryRouteStore implements RouteStore {
  private routes: GPXRoute[] = []

  getAll(): GPXRoute[] {
    return [...this.routes]
  }

  save(route: GPXRoute): void {
    this.routes.push(route)
  }

  deleteByIndex(index: number): void {
    this.routes.splice(index, 1)
  }

  clear(): void {
    this.routes = []
  }
}
