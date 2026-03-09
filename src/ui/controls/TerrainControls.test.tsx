import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TerrainControls } from './TerrainControls'

const defaultProps = {
  exaggeration: 1,
  onExaggerationChange: vi.fn(),
  showSlopeHeatmap: false,
  onToggleSlopeHeatmap: vi.fn(),
  onScreenshot: vi.fn(),
}

describe('TerrainControls', () => {
  it('renders the exaggeration slider with Spanish label', () => {
    render(<TerrainControls {...defaultProps} />)
    expect(screen.getByText(/Exageración/i)).toBeInTheDocument()
  })

  it('displays the current exaggeration value', () => {
    render(<TerrainControls {...defaultProps} exaggeration={2.5} />)
    expect(screen.getByText('2.5x')).toBeInTheDocument()
  })

  it('calls onExaggerationChange when slider is moved', () => {
    const onChange = vi.fn()
    render(<TerrainControls {...defaultProps} onExaggerationChange={onChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '3' } })
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('renders slope heatmap toggle button', () => {
    render(<TerrainControls {...defaultProps} />)
    expect(screen.getByText(/Pendiente/i)).toBeInTheDocument()
  })

  it('calls onToggleSlopeHeatmap when button clicked', () => {
    const onToggle = vi.fn()
    render(<TerrainControls {...defaultProps} onToggleSlopeHeatmap={onToggle} />)
    fireEvent.click(screen.getByText(/Pendiente/i))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('renders screenshot button', () => {
    render(<TerrainControls {...defaultProps} />)
    expect(screen.getByText(/Captura/i)).toBeInTheDocument()
  })

  it('calls onScreenshot when button clicked', () => {
    const onShot = vi.fn()
    render(<TerrainControls {...defaultProps} onScreenshot={onShot} />)
    fireEvent.click(screen.getByText(/Captura/i))
    expect(onShot).toHaveBeenCalledTimes(1)
  })
})
