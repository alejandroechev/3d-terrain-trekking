import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { TerrainMesh } from './TerrainMesh'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <canvas data-testid="r3f-canvas">{children}</canvas>
  ),
  useFrame: vi.fn(),
}))

vi.mock('three', async () => {
  const actual = await vi.importActual('three')
  return {
    ...actual,
    BufferGeometry: class {
      setAttribute = vi.fn()
      setIndex = vi.fn()
      computeVertexNormals = vi.fn()
    },
    BufferAttribute: class {
      array: unknown
      itemSize: number
      constructor(array: unknown, itemSize: number) {
        this.array = array
        this.itemSize = itemSize
      }
    },
    MeshStandardMaterial: class {},
  }
})

describe('TerrainMesh', () => {
  it('renders without crashing', () => {
    const { container } = render(<TerrainMesh exaggeration={1} meshSize={50} />)
    expect(container).toBeDefined()
  })
})
