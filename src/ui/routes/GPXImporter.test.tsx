import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GPXImporter } from './GPXImporter'

describe('GPXImporter', () => {
  it('renders the drop zone with Spanish text', () => {
    render(<GPXImporter onRoutesLoaded={vi.fn()} />)
    expect(screen.getByText(/Arrastra un archivo GPX/i)).toBeInTheDocument()
  })

  it('calls onRoutesLoaded when a valid GPX file is dropped', async () => {
    const onRoutesLoaded = vi.fn()
    render(<GPXImporter onRoutesLoaded={onRoutesLoaded} />)

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"><trk><name>Test</name><trkseg>
  <trkpt lat="-41.32" lon="-72.98"><ele>100</ele></trkpt>
  <trkpt lat="-41.33" lon="-72.99"><ele>200</ele></trkpt>
</trkseg></trk></gpx>`

    const file = new File([gpxContent], 'test.gpx', { type: 'application/gpx+xml' })
    const dropZone = screen.getByTestId('gpx-drop-zone')

    // Simulate file input change (simpler than drag event in jsdom)
    const input = dropZone.querySelector('input[type="file"]')!
    await fireEvent.change(input, { target: { files: [file] } })

    // Wait for async file read
    await vi.waitFor(() => {
      expect(onRoutesLoaded).toHaveBeenCalledTimes(1)
    })

    const routes = onRoutesLoaded.mock.calls[0][0]
    expect(routes.length).toBe(1)
    expect(routes[0].name).toBe('Test')
  })
})
