import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <canvas data-testid="r3f-canvas" {...props}>
      {children}
    </canvas>
  ),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Grid: () => null,
}))

describe('App', () => {
  it('renders the app title in Spanish', () => {
    render(<App />)
    expect(screen.getByText('Explorador de Terreno 3D')).toBeInTheDocument()
  })

  it('renders the location subtitle', () => {
    render(<App />)
    expect(screen.getByText('Puerto Varas, Chile')).toBeInTheDocument()
  })

  it('renders a 3D canvas', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
