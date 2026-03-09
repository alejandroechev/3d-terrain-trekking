import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

vi.mock('./domain/trek/load-treks', () => ({
  loadAllTreks: vi.fn(() => Promise.resolve([])),
}))

describe('App', () => {
  it('renders the app header', () => {
    render(<App />)
    expect(screen.getByText(/Senderos del Sur/)).toBeInTheDocument()
  })

  it('renders the region subtitle', () => {
    render(<App />)
    expect(screen.getByText(/Región de los Lagos/)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<App />)
    expect(screen.getByText('Cargando senderos…')).toBeInTheDocument()
  })

  it('shows empty state after loading', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('No se encontraron senderos')).toBeInTheDocument()
    })
  })

  it('renders sort bar', () => {
    render(<App />)
    expect(screen.getByText(/Nombre/)).toBeInTheDocument()
    expect(screen.getByText(/Dificultad/)).toBeInTheDocument()
  })

  it('renders region filter', () => {
    render(<App />)
    expect(screen.getByText('Todas las regiones')).toBeInTheDocument()
  })
})
