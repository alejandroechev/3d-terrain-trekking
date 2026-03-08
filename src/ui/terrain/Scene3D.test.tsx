import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Scene3D } from './Scene3D'

// R3F Canvas requires WebGL which jsdom doesn't provide.
// Mock the Canvas to render a plain canvas element.
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

describe('Scene3D', () => {
  it('renders a canvas element', () => {
    const { getByTestId } = render(<Scene3D />)
    expect(getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
