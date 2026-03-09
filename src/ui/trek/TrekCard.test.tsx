import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrekCard } from './TrekCard'
import type { Trek } from '../../domain/trek/trek'

function makeTrek(overrides: Partial<Trek> = {}): Trek {
  return {
    id: 'volcan-osorno',
    name: 'Volcán Osorno',
    description: 'Sendero hacia la base del volcán',
    region: 'PN Vicente Pérez Rosales',
    gpxRoute: {
      name: 'Volcán Osorno',
      points: [
        { lat: -41.1, lng: -72.5, elevation: 800 },
        { lat: -41.11, lng: -72.51, elevation: 900 },
      ],
    },
    stats: {
      totalDistanceM: 8000,
      totalAscentM: 450,
      totalDescentM: 430,
      maxGradePercent: 18,
      avgGradePercent: 8,
      minElevationM: 600,
      maxElevationM: 1050,
      estimatedTimeMinutes: 150,
    },
    difficulty: { score: 42, label: 'Moderado', color: '#eab308' },
    distanceFromHomeKm: 35.2,
    startLat: -41.1,
    startLng: -72.5,
    ...overrides,
  }
}

describe('TrekCard', () => {
  const defaultProps = {
    trek: makeTrek(),
    isFavorite: false,
    onToggleFavorite: vi.fn(),
    onSelect: vi.fn(),
  }

  it('renders trek name', () => {
    render(<TrekCard {...defaultProps} />)
    expect(screen.getByText('Volcán Osorno')).toBeInTheDocument()
  })

  it('renders region tag', () => {
    const trek = makeTrek({ region: 'Lago Chapo' })
    render(<TrekCard {...defaultProps} trek={trek} />)
    expect(screen.getByText('Lago Chapo')).toBeInTheDocument()
  })

  it('renders difficulty badge with score and label', () => {
    render(<TrekCard {...defaultProps} />)
    expect(screen.getByText('42 Moderado')).toBeInTheDocument()
  })

  it('renders key stats: distance, ascent, estimated time', () => {
    render(<TrekCard {...defaultProps} />)
    expect(screen.getByText('8.0 km')).toBeInTheDocument()
    expect(screen.getByText(/450 m/)).toBeInTheDocument()
    expect(screen.getByText(/2h 30min/)).toBeInTheDocument()
  })

  it('renders distance from home', () => {
    render(<TrekCard {...defaultProps} />)
    expect(screen.getByText(/35 km/)).toBeInTheDocument()
  })

  it('renders filled star when favorite', () => {
    render(<TrekCard {...defaultProps} isFavorite={true} />)
    expect(screen.getByLabelText('Quitar favorito')).toBeInTheDocument()
  })

  it('renders empty star when not favorite', () => {
    render(<TrekCard {...defaultProps} isFavorite={false} />)
    expect(screen.getByLabelText('Agregar favorito')).toBeInTheDocument()
  })

  it('calls onToggleFavorite when favorite button clicked', () => {
    const onToggleFavorite = vi.fn()
    render(<TrekCard {...defaultProps} onToggleFavorite={onToggleFavorite} />)
    fireEvent.click(screen.getByLabelText('Agregar favorito'))
    expect(onToggleFavorite).toHaveBeenCalledWith('volcan-osorno')
  })

  it('calls onSelect when card clicked', () => {
    const onSelect = vi.fn()
    render(<TrekCard {...defaultProps} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('article'))
    expect(onSelect).toHaveBeenCalledWith(defaultProps.trek)
  })

  it('does not call onSelect when favorite button clicked', () => {
    const onSelect = vi.fn()
    render(<TrekCard {...defaultProps} onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('Agregar favorito'))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
