import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchTrails, buildOverpassQuery } from './overpass-trails'
import type { BBox } from '../elevation/elevation'

const BBOX: BBox = {
  south: -41.35,
  north: -41.30,
  west: -73.00,
  east: -72.95,
}

describe('buildOverpassQuery', () => {
  it('returns a valid Overpass QL query string', () => {
    const query = buildOverpassQuery(BBOX)
    expect(query).toContain('highway')
    expect(query).toContain('-41.35')
    expect(query).toContain('-73')
    expect(query).toContain('out body')
  })

  it('includes path, footway, and hiking route types', () => {
    const query = buildOverpassQuery(BBOX)
    expect(query).toContain('"highway"="path"')
    expect(query).toContain('"highway"="footway"')
    expect(query).toContain('"route"="hiking"')
  })
})

describe('searchTrails', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('parses Overpass XML response into trail objects', async () => {
    const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6">
  <way id="123">
    <tag k="name" v="Sendero Test"/>
    <tag k="highway" v="path"/>
    <nd ref="1"/><nd ref="2"/>
  </way>
  <node id="1" lat="-41.32" lon="-72.98"/>
  <node id="2" lat="-41.33" lon="-72.97"/>
</osm>`

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockXml),
    } as Response)

    const trails = await searchTrails(BBOX)
    expect(trails.length).toBeGreaterThanOrEqual(1)
    expect(trails[0].name).toBe('Sendero Test')
    expect(trails[0].points.length).toBe(2)
  })

  it('returns empty array on API error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('error'),
    } as unknown as Response)

    const trails = await searchTrails(BBOX)
    expect(trails).toEqual([])
  })

  it('assigns default name for unnamed trails', async () => {
    const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6">
  <way id="456">
    <tag k="highway" v="footway"/>
    <nd ref="1"/><nd ref="2"/>
  </way>
  <node id="1" lat="-41.32" lon="-72.98"/>
  <node id="2" lat="-41.33" lon="-72.97"/>
</osm>`

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockXml),
    } as Response)

    const trails = await searchTrails(BBOX)
    expect(trails[0].name).toBe('Sendero #456')
  })
})
