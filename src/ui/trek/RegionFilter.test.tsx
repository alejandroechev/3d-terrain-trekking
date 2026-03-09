import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegionFilter } from './RegionFilter'

describe('RegionFilter', () => {
  const regions = ['Cochamó', 'Frutillar', 'Puerto Varas']

  it('renders "Todas las regiones" option', () => {
    render(<RegionFilter regions={regions} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByText('Todas las regiones')).toBeInTheDocument()
  })

  it('renders all region names', () => {
    render(<RegionFilter regions={regions} selected={null} onSelect={vi.fn()} />)
    for (const r of regions) {
      expect(screen.getByText(r)).toBeInTheDocument()
    }
  })

  it('highlights selected region', () => {
    render(<RegionFilter regions={regions} selected="Cochamó" onSelect={vi.fn()} />)
    const btn = screen.getByText('Cochamó')
    expect(btn.className).toContain('bg-green-700')
  })

  it('highlights "Todas" when no region selected', () => {
    render(<RegionFilter regions={regions} selected={null} onSelect={vi.fn()} />)
    const btn = screen.getByText('Todas las regiones')
    expect(btn.className).toContain('bg-green-700')
  })

  it('calls onSelect with region name when clicked', () => {
    const onSelect = vi.fn()
    render(<RegionFilter regions={regions} selected={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Frutillar'))
    expect(onSelect).toHaveBeenCalledWith('Frutillar')
  })

  it('calls onSelect with null when "Todas" clicked', () => {
    const onSelect = vi.fn()
    render(<RegionFilter regions={regions} selected="Cochamó" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Todas las regiones'))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
