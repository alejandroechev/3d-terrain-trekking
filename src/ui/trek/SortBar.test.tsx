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
})
