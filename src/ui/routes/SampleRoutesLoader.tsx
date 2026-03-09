import { useCallback, useState } from 'react'
import { parseGPX, type GPXRoute } from '../../domain/gpx/gpx-parser'

const SAMPLE_FILES = [
  '/gpx-samples/cerro-philippi.gpx',
  '/gpx-samples/costanera-llanquihue.gpx',
  '/gpx-samples/saltos-petrohue.gpx',
]

interface SampleRoutesLoaderProps {
  onRoutesLoaded: (routes: GPXRoute[]) => void
}

export function SampleRoutesLoader({ onRoutesLoaded }: SampleRoutesLoaderProps) {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleLoad = useCallback(async () => {
    setLoading(true)
    try {
      const allRoutes: GPXRoute[] = []
      for (const file of SAMPLE_FILES) {
        const res = await fetch(file)
        if (res.ok) {
          const text = await res.text()
          const routes = parseGPX(text)
          allRoutes.push(...routes)
        }
      }
      onRoutesLoaded(allRoutes)
      setLoaded(true)
    } finally {
      setLoading(false)
    }
  }, [onRoutesLoaded])

  if (loaded) {
    return (
      <div className="text-xs text-green-400 text-center py-1">
        ✅ 3 rutas cargadas
      </div>
    )
  }

  return (
    <button
      onClick={handleLoad}
      disabled={loading}
      className="w-full text-xs px-3 py-2 rounded bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
    >
      {loading ? '⏳ Cargando...' : '🗺️ Cargar rutas de ejemplo'}
    </button>
  )
}
