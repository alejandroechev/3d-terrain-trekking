import { describe, it, expect } from 'vitest'
import {
  InMemoryFavoritesStore,
  LocalStorageFavoritesStore,
} from './favorites-store'

function favoritesStoreTests(createStore: () => import('./favorites-store').FavoritesStore) {
  it('toggle adds a trek ID when not present', () => {
    const store = createStore()
    store.toggle('cerro-philippi')
    expect(store.isFavorite('cerro-philippi')).toBe(true)
  })

  it('toggle removes a trek ID when already present', () => {
    const store = createStore()
    store.toggle('cerro-philippi')
    store.toggle('cerro-philippi')
    expect(store.isFavorite('cerro-philippi')).toBe(false)
  })

  it('isFavorite returns false for unknown trek', () => {
    const store = createStore()
    expect(store.isFavorite('nonexistent')).toBe(false)
  })

  it('getAll returns all favorite IDs', () => {
    const store = createStore()
    store.toggle('cerro-philippi')
    store.toggle('volcan-osorno')
    expect(store.getAll()).toEqual(
      expect.arrayContaining(['cerro-philippi', 'volcan-osorno']),
    )
    expect(store.getAll()).toHaveLength(2)
  })

  it('getAll returns empty array when no favorites', () => {
    const store = createStore()
    expect(store.getAll()).toEqual([])
  })
}

describe('InMemoryFavoritesStore', () => {
  favoritesStoreTests(() => new InMemoryFavoritesStore())
})

describe('LocalStorageFavoritesStore', () => {
  favoritesStoreTests(() => {
    localStorage.clear()
    return new LocalStorageFavoritesStore()
  })

  it('persists across instances', () => {
    localStorage.clear()
    const first = new LocalStorageFavoritesStore()
    first.toggle('cerro-philippi')

    const second = new LocalStorageFavoritesStore()
    expect(second.isFavorite('cerro-philippi')).toBe(true)
    expect(second.getAll()).toEqual(['cerro-philippi'])
  })
})
