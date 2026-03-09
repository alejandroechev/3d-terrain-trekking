import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SortBar } from './SortBar'
import type { SortCriteria } from '../../domain/trek/trek-catalog'

describe('SortBar', () => {
  it('renders all sort buttons', () => {
    const criteria: SortCriteria[] = [{ field: 'name', direction: 'asc' }]
    render(<SortBar criteria={criteria} onSort={vi.fn()} />)
    expect(screen.getByText(/Dificultad/)).toBeInTheDocument()
    expect(screen.getByText(/Distancia/)).toBeInTheDocument()
    expect(screen.getByText(/Largo/)).toBeInTheDocument()
    expect(screen.getByText(/Nombre/)).toBeInTheDocument()
  })

  it('highlights active sort field', () => {
    const criteria: SortCriteria[] = [{ field: 'difficulty', direction: 'asc' }]
    render(<SortBar criteria={criteria} onSort={vi.fn()} />)
    const activeBtn = screen.getByText(/Dificultad/)
    expect(activeBtn.className).toContain('bg-green-700')
  })

  it('shows ascending arrow for asc direction', () => {
    const criteria: SortCriteria[] = [{ field: 'name', direction: 'asc' }]
    render(<SortBar criteria={criteria} onSort={vi.fn()} />)
    expect(screen.getByText(/Nombre/).textContent).toContain('↑')
  })

  it('shows descending arrow for desc direction', () => {
    const criteria: SortCriteria[] = [{ field: 'name', direction: 'desc' }]
    render(<SortBar criteria={criteria} onSort={vi.fn()} />)
    expect(screen.getByText(/Nombre/).textContent).toContain('↓')
  })

  it('calls onSort with field when button clicked', () => {
    const onSort = vi.fn()
    const criteria: SortCriteria[] = [{ field: 'name', direction: 'asc' }]
    render(<SortBar criteria={criteria} onSort={onSort} />)
    fireEvent.click(screen.getByText(/Distancia/))
    expect(onSort).toHaveBeenCalledWith('distance')
  })

  it('shows numbered badge for multi-sort criteria', () => {
    const criteria: SortCriteria[] = [
      { field: 'difficulty', direction: 'asc' },
      { field: 'length', direction: 'asc' },
    ]
    render(<SortBar criteria={criteria} onSort={vi.fn()} />)
    // Both difficulty and length should be active with numbered badges
    const diffBtn = screen.getByText(/Dificultad/)
    const largoBtn = screen.getByText(/Largo/)
    expect(diffBtn.className).toContain('bg-green-700')
    expect(largoBtn.className).toContain('bg-green-600')
  })

  it('shows clear button when multiple sorts are active', () => {
    const criteria: SortCriteria[] = [
      { field: 'difficulty', direction: 'asc' },
      { field: 'length', direction: 'asc' },
    ]
    const onSort = vi.fn()
    render(<SortBar criteria={criteria} onSort={onSort} onClear={vi.fn()} />)
    expect(screen.getByLabelText('Limpiar orden')).toBeInTheDocument()
  })
})
