import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrailSearch } from './TrailSearch'

describe('TrailSearch', () => {
  it('renders search button with Spanish text', () => {
    render(<TrailSearch onTrailsFound={vi.fn()} bbox={{ south: -41.35, north: -41.30, west: -73, east: -72.95 }} />)
    expect(screen.getByText(/Buscar senderos/i)).toBeInTheDocument()
  })

  it('shows loading state when clicked', async () => {
    globalThis.fetch = vi.fn().mockImplementation(() => new Promise(() => {}))
    render(<TrailSearch onTrailsFound={vi.fn()} bbox={{ south: -41.35, north: -41.30, west: -73, east: -72.95 }} />)
    fireEvent.click(screen.getByText(/Buscar senderos/i))
    expect(screen.getByText(/Buscando/i)).toBeInTheDocument()
  })
})
