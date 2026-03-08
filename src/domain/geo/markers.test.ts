import { describe, it, expect } from 'vitest'
import {
  createMarker,
  type PlaceMarker,
  serializeMarkers,
  deserializeMarkers,
} from './markers'

describe('markers', () => {
  describe('createMarker', () => {
    it('creates a marker with name, lat, lng', () => {
      const marker = createMarker('Volcán Osorno', -41.1, -72.49)
      expect(marker.name).toBe('Volcán Osorno')
      expect(marker.lat).toBe(-41.1)
      expect(marker.lng).toBe(-72.49)
      expect(marker.id).toBeTruthy()
    })

    it('generates unique IDs', () => {
      const m1 = createMarker('A', -41, -72)
      const m2 = createMarker('B', -41, -72)
      expect(m1.id).not.toBe(m2.id)
    })
  })

  describe('serialization', () => {
    it('round-trips markers through JSON', () => {
      const markers: PlaceMarker[] = [
        createMarker('Volcán Osorno', -41.1, -72.49),
        createMarker('Lago Llanquihue', -41.15, -72.83),
      ]
      const json = serializeMarkers(markers)
      const restored = deserializeMarkers(json)
      expect(restored.length).toBe(2)
      expect(restored[0].name).toBe('Volcán Osorno')
      expect(restored[1].lat).toBe(-41.15)
    })

    it('handles empty array', () => {
      const json = serializeMarkers([])
      const restored = deserializeMarkers(json)
      expect(restored).toEqual([])
    })

    it('handles invalid JSON gracefully', () => {
      const restored = deserializeMarkers('not json')
      expect(restored).toEqual([])
    })
  })
})
