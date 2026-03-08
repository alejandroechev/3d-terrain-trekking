import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

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

describe('App', () => {
  it('renders the app title in Spanish', () => {
    render(<App />)
    expect(screen.getByText('Explorador de Terreno 3D')).toBeInTheDocument()
  })

  it('renders the location subtitle', () => {
    render(<App />)
    expect(screen.getByText('Puerto Varas, Chile')).toBeInTheDocument()
  })

  it('renders a 3D canvas', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('r3f-canvas')).toBeInTheDocument()
  })

  it('renders the GPX importer drop zone', () => {
    render(<App />)
    expect(screen.getByText(/Arrastra un archivo GPX/i)).toBeInTheDocument()
  })

  it('shows route stats when a GPX file is loaded', async () => {
    render(<App />)

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"><trk><name>Cerro Test</name><trkseg>
  <trkpt lat="-41.32" lon="-72.98"><ele>100</ele></trkpt>
  <trkpt lat="-41.33" lon="-72.99"><ele>300</ele></trkpt>
</trkseg></trk></gpx>`

    const file = new File([gpxContent], 'test.gpx', { type: 'application/gpx+xml' })
    const dropZone = screen.getByTestId('gpx-drop-zone')
    const input = dropZone.querySelector('input[type="file"]')!
    await fireEvent.change(input, { target: { files: [file] } })

    await vi.waitFor(() => {
      expect(screen.getAllByText('Cerro Test').length).toBeGreaterThanOrEqual(1)
    })
  })
})
