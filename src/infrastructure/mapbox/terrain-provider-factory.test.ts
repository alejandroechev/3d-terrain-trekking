import { describe, it, expect } from 'vitest'
import { createTerrainProvider } from './terrain-provider-factory'
import { StubTerrainTileProvider } from '../stubs/stub-terrain-provider'

describe('createTerrainProvider', () => {
  it('returns a StubTerrainTileProvider when no API key is configured', () => {
    const provider = createTerrainProvider()
    expect(provider).toBeInstanceOf(StubTerrainTileProvider)
  })

  it('returns a MapboxTerrainTileProvider when an API key is provided', () => {
    const provider = createTerrainProvider('pk.test_fake_key')
    // Should NOT be the stub when a key is given
    expect(provider).not.toBeInstanceOf(StubTerrainTileProvider)
  })
})
