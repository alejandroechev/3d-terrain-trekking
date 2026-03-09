import { describe, it, expect } from 'vitest'
import { InMemoryRouteStore } from './in-memory-route-store'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'

const ROUTE: GPXRoute = {
  name: 'Cerro Philippi',
  points: [
    { lat: -41.32, lng: -72.98, elevation: 100 },
    { lat: -41.33, lng: -72.97, elevation: 300 },
  ],
}

describe('InMemoryRouteStore', () => {
  it('starts empty', () => {
    const store = new InMemoryRouteStore()
    expect(store.getAll()).toEqual([])
  })

  it('saves and retrieves a route', () => {
    const store = new InMemoryRouteStore()
    store.save(ROUTE)
    const all = store.getAll()
    expect(all.length).toBe(1)
    expect(all[0].name).toBe('Cerro Philippi')
  })

  it('saves multiple routes', () => {
    const store = new InMemoryRouteStore()
    store.save(ROUTE)
    store.save({ ...ROUTE, name: 'Volcán Osorno' })
    expect(store.getAll().length).toBe(2)
  })

  it('deletes a route by index', () => {
    const store = new InMemoryRouteStore()
    store.save(ROUTE)
    store.save({ ...ROUTE, name: 'Volcán Osorno' })
    store.deleteByIndex(0)
    const all = store.getAll()
    expect(all.length).toBe(1)
    expect(all[0].name).toBe('Volcán Osorno')
  })

  it('clears all routes', () => {
    const store = new InMemoryRouteStore()
    store.save(ROUTE)
    store.save({ ...ROUTE, name: 'Volcán Osorno' })
    store.clear()
    expect(store.getAll()).toEqual([])
  })
})
