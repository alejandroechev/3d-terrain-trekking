import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouteComparison } from './RouteComparison'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(), fillRect: vi.fn(), beginPath: vi.fn(),
  moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(),
  stroke: vi.fn(), fill: vi.fn(), fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 10 })), setLineDash: vi.fn(),
  save: vi.fn(), restore: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  set strokeStyle(_v: string) {}, set fillStyle(_v: string | CanvasGradient) {},
  set lineWidth(_v: number) {}, set font(_v: string) {},
  set textAlign(_v: string) {}, set textBaseline(_v: string) {},
  set globalAlpha(_v: number) {},
})) as unknown as typeof HTMLCanvasElement.prototype.getContext

const ROUTES: GPXRoute[] = [
  {
    name: 'Ruta Fácil',
    points: [
      { lat: -41.320, lng: -72.980, elevation: 100 },
      { lat: -41.321, lng: -72.979, elevation: 110 },
    ],
  },
  {
    name: 'Ruta Difícil',
    points: [
      { lat: -41.320, lng: -72.980, elevation: 100 },
      { lat: -41.325, lng: -72.975, elevation: 900 },
    ],
  },
]

describe('RouteComparison', () => {
  it('renders the comparison heading in Spanish', () => {
    render(<RouteComparison routes={ROUTES} />)
    expect(screen.getByText(/Comparar rutas/i)).toBeInTheDocument()
  })

  it('lists all route names', () => {
    render(<RouteComparison routes={ROUTES} />)
    expect(screen.getByText('Ruta Fácil')).toBeInTheDocument()
    expect(screen.getByText('Ruta Difícil')).toBeInTheDocument()
  })

  it('does not render when fewer than 2 routes', () => {
    const { container } = render(<RouteComparison routes={[ROUTES[0]]} />)
    expect(container.textContent).toBe('')
  })
})
