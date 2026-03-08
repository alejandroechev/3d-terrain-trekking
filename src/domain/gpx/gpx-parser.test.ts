import { describe, it, expect } from 'vitest'
import { parseGPX } from './gpx-parser'

// Minimal valid GPX with a track
const SAMPLE_GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <trk>
    <name>Cerro Philippi</name>
    <trkseg>
      <trkpt lat="-41.3200" lon="-72.9800">
        <ele>100</ele>
      </trkpt>
      <trkpt lat="-41.3210" lon="-72.9790">
        <ele>250</ele>
      </trkpt>
      <trkpt lat="-41.3220" lon="-72.9780">
        <ele>500</ele>
      </trkpt>
      <trkpt lat="-41.3215" lon="-72.9785">
        <ele>450</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`

// GPX with a route (rte) instead of track
const ROUTE_GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <rte>
    <name>Sendero Los Alerces</name>
    <rtept lat="-41.4000" lon="-72.2000">
      <ele>200</ele>
    </rtept>
    <rtept lat="-41.4010" lon="-72.2010">
      <ele>300</ele>
    </rtept>
  </rte>
</gpx>`

const EMPTY_GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test"></gpx>`

describe('parseGPX', () => {
  it('extracts the track name', () => {
    const routes = parseGPX(SAMPLE_GPX)
    expect(routes.length).toBe(1)
    expect(routes[0].name).toBe('Cerro Philippi')
  })

  it('extracts all track points with lat, lng, elevation', () => {
    const routes = parseGPX(SAMPLE_GPX)
    const points = routes[0].points
    expect(points.length).toBe(4)
    expect(points[0].lat).toBeCloseTo(-41.32, 4)
    expect(points[0].lng).toBeCloseTo(-72.98, 4)
    expect(points[0].elevation).toBe(100)
  })

  it('handles GPX routes (rte/rtept) in addition to tracks', () => {
    const routes = parseGPX(ROUTE_GPX)
    expect(routes.length).toBe(1)
    expect(routes[0].name).toBe('Sendero Los Alerces')
    expect(routes[0].points.length).toBe(2)
  })

  it('returns an empty array for GPX with no tracks or routes', () => {
    const routes = parseGPX(EMPTY_GPX)
    expect(routes).toEqual([])
  })

  it('assigns a default name when track has no name element', () => {
    const noNameGPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"><trk><trkseg>
  <trkpt lat="-41.32" lon="-72.98"><ele>100</ele></trkpt>
  <trkpt lat="-41.33" lon="-72.99"><ele>200</ele></trkpt>
</trkseg></trk></gpx>`
    const routes = parseGPX(noNameGPX)
    expect(routes[0].name).toBe('Ruta sin nombre')
  })

  it('defaults elevation to 0 when ele element is missing', () => {
    const noEleGPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"><trk><name>Test</name><trkseg>
  <trkpt lat="-41.32" lon="-72.98"></trkpt>
  <trkpt lat="-41.33" lon="-72.99"><ele>50</ele></trkpt>
</trkseg></trk></gpx>`
    const routes = parseGPX(noEleGPX)
    expect(routes[0].points[0].elevation).toBe(0)
  })
})
