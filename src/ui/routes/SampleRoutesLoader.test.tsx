import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SampleRoutesLoader } from './SampleRoutesLoader'

globalThis.fetch = vi.fn()

describe('SampleRoutesLoader', () => {
  it('renders a button with Spanish text', () => {
    render(<SampleRoutesLoader onRoutesLoaded={vi.fn()} />)
    expect(screen.getByText(/Cargar rutas de ejemplo/i)).toBeInTheDocument()
  })

  it('fetches sample GPX files on click', async () => {
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"><trk><name>Test</name><trkseg>
  <trkpt lat="-41.32" lon="-72.98"><ele>100</ele></trkpt>
  <trkpt lat="-41.33" lon="-72.97"><ele>200</ele></trkpt>
</trkseg></trk></gpx>`

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(gpxContent),
    } as Response)

    const onLoaded = vi.fn()
    render(<SampleRoutesLoader onRoutesLoaded={onLoaded} />)
    fireEvent.click(screen.getByText(/Cargar rutas de ejemplo/i))

    await vi.waitFor(() => {
      expect(onLoaded).toHaveBeenCalled()
    })
  })
})
