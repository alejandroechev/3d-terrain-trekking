import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ElevationProfileChart } from './ElevationProfileChart'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'

const ROUTE: GPXRoute = {
  name: 'Test Route',
  points: [
    { lat: -41.320, lng: -72.980, elevation: 100 },
    { lat: -41.321, lng: -72.979, elevation: 250 },
    { lat: -41.322, lng: -72.978, elevation: 500 },
    { lat: -41.323, lng: -72.977, elevation: 450 },
  ],
}

// Mock canvas getContext since jsdom doesn't support it
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 10 })),
  setLineDash: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  set strokeStyle(_v: string) {},
  set fillStyle(_v: string | CanvasGradient) {},
  set lineWidth(_v: number) {},
  set font(_v: string) {},
  set textAlign(_v: string) {},
  set textBaseline(_v: string) {},
  set globalAlpha(_v: number) {},
})) as unknown as typeof HTMLCanvasElement.prototype.getContext

describe('ElevationProfileChart', () => {
  it('renders a canvas element with the correct test id', () => {
    render(<ElevationProfileChart route={ROUTE} />)
    expect(screen.getByTestId('elevation-chart')).toBeInTheDocument()
  })

  it('renders the route name as heading', () => {
    render(<ElevationProfileChart route={ROUTE} />)
    expect(screen.getByText('Test Route')).toBeInTheDocument()
  })
})
