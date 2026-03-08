import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Route3D } from './Route3D'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'

vi.mock('three', async () => {
  const actual = await vi.importActual('three')
  return {
    ...actual,
    Line: class {
      geometry: unknown
      material: unknown
      constructor(geometry: unknown, material: unknown) {
        this.geometry = geometry
        this.material = material
      }
    },
  }
})

const ROUTE: GPXRoute = {
  name: 'Test Route',
  points: [
    { lat: -41.32, lng: -72.98, elevation: 100 },
    { lat: -41.33, lng: -72.97, elevation: 300 },
    { lat: -41.34, lng: -72.96, elevation: 200 },
  ],
}

const BBOX = { north: -41.30, south: -41.35, east: -72.95, west: -73.00 }

describe('Route3D', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Route3D route={ROUTE} bbox={BBOX} meshSize={100} exaggeration={1} />
    )
    expect(container).toBeDefined()
  })
})
