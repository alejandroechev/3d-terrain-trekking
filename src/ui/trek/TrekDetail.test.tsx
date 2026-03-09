import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrekDetail } from './TrekDetail'
import type { Trek } from '../../domain/trek/trek'
import type { TrekEvent } from '../../domain/events/event-log'

function makeTrek(overrides: Partial<Trek> = {}): Trek {
  return {
    id: 'volcan-osorno',
    name: 'Volcán Osorno',
    description: 'Sendero hacia la base del volcán Osorno',
    region: 'Volcán Osorno',
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

describe('TrekDetail', () => {
  const defaultProps = {
    trek: makeTrek(),
    isFavorite: false,
    events: [] as TrekEvent[],
    onToggleFavorite: vi.fn(),
    onAddEvent: vi.fn(),
    onDeleteEvent: vi.fn(),
    onBack: vi.fn(),
  }

  it('renders trek name as heading', () => {
    render(<TrekDetail {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'Volcán Osorno', level: 2 })).toBeInTheDocument()
  })

  it('renders back button with "Volver"', () => {
    render(<TrekDetail {...defaultProps} />)
    expect(screen.getByText('← Volver')).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn()
    render(<TrekDetail {...defaultProps} onBack={onBack} />)
    fireEvent.click(screen.getByText('← Volver'))
    expect(onBack).toHaveBeenCalled()
  })

  it('renders region and difficulty badge', () => {
    render(<TrekDetail {...defaultProps} />)
    expect(screen.getByText('Volcán Osorno', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText('42 Moderado')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<TrekDetail {...defaultProps} />)
    expect(screen.getByText('Sendero hacia la base del volcán Osorno')).toBeInTheDocument()
  })

  it('renders stats grid', () => {
    render(<TrekDetail {...defaultProps} />)
    expect(screen.getByText('8.0 km')).toBeInTheDocument()
    expect(screen.getByText('450 m')).toBeInTheDocument()
    expect(screen.getByText('430 m')).toBeInTheDocument()
    expect(screen.getByText('18%')).toBeInTheDocument()
    expect(screen.getByText('1050 m')).toBeInTheDocument()
    expect(screen.getByText('2h 30min')).toBeInTheDocument()
  })

  it('renders Google Maps link with correct href', () => {
    render(<TrekDetail {...defaultProps} />)
    const link = screen.getByText('📍 Abrir en Google Maps')
    expect(link).toHaveAttribute('href', 'https://www.google.com/maps?q=-41.1,-72.5')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders favorite toggle', () => {
    render(<TrekDetail {...defaultProps} isFavorite={false} />)
    expect(screen.getByLabelText('Agregar favorito')).toBeInTheDocument()
  })

  it('calls onToggleFavorite', () => {
    const onToggleFavorite = vi.fn()
    render(<TrekDetail {...defaultProps} onToggleFavorite={onToggleFavorite} />)
    fireEvent.click(screen.getByLabelText('Agregar favorito'))
    expect(onToggleFavorite).toHaveBeenCalledWith('volcan-osorno')
  })

  it('renders event log heading', () => {
    render(<TrekDetail {...defaultProps} />)
    expect(screen.getByText('Registro de salidas')).toBeInTheDocument()
  })

  it('renders events list', () => {
    const events: TrekEvent[] = [
      { id: '1', trekId: 'volcan-osorno', date: '2024-01-15', description: 'Gran caminata' },
    ]
    render(<TrekDetail {...defaultProps} events={events} />)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    expect(screen.getByText('Gran caminata')).toBeInTheDocument()
  })

  it('calls onDeleteEvent when delete clicked', () => {
    const onDeleteEvent = vi.fn()
    const events: TrekEvent[] = [
      { id: '1', trekId: 'volcan-osorno', date: '2024-01-15', description: 'Gran caminata' },
    ]
    render(<TrekDetail {...defaultProps} events={events} onDeleteEvent={onDeleteEvent} />)
    fireEvent.click(screen.getByLabelText('Eliminar salida'))
    expect(onDeleteEvent).toHaveBeenCalledWith('1')
  })

  it('submits add event form', () => {
    const onAddEvent = vi.fn()
    render(<TrekDetail {...defaultProps} onAddEvent={onAddEvent} />)
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2024-03-01' } })
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Día soleado' } })
    fireEvent.click(screen.getByText('Agregar'))
    expect(onAddEvent).toHaveBeenCalledWith('volcan-osorno', '2024-03-01', 'Día soleado')
  })

  it('shows empty state when no events', () => {
    render(<TrekDetail {...defaultProps} events={[]} />)
    expect(screen.getByText('Sin salidas registradas')).toBeInTheDocument()
  })
})
