import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TerrainControls } from './TerrainControls'

describe('TerrainControls', () => {
  it('renders the exaggeration slider with Spanish label', () => {
    render(
      <TerrainControls
        exaggeration={1}
        onExaggerationChange={vi.fn()}
      />
    )
    expect(screen.getByText(/Exageración/i)).toBeInTheDocument()
  })

  it('displays the current exaggeration value', () => {
    render(
      <TerrainControls
        exaggeration={2.5}
        onExaggerationChange={vi.fn()}
      />
    )
    expect(screen.getByText('2.5x')).toBeInTheDocument()
  })

  it('calls onExaggerationChange when slider is moved', () => {
    const onChange = vi.fn()
    render(
      <TerrainControls
        exaggeration={1}
        onExaggerationChange={onChange}
      />
    )
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '3' } })
    expect(onChange).toHaveBeenCalledWith(3)
  })
})
