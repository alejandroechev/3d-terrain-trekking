import { useCallback, useState } from 'react'
import type { BBox } from '../../domain/elevation/elevation'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'
import { searchTrails } from '../../domain/gpx/overpass-trails'

interface TrailSearchProps {
  bbox: BBox
  onTrailsFound: (trails: GPXRoute[]) => void
}

export function TrailSearch({ bbox, onTrailsFound }: TrailSearchProps) {
  const [loading, setLoading] = useState(false)
  const [resultCount, setResultCount] = useState<number | null>(null)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    try {
      const trails = await searchTrails(bbox)
      setResultCount(trails.length)
      if (trails.length > 0) {
        onTrailsFound(trails)
      }
    } finally {
      setLoading(false)
    }
  }, [bbox, onTrailsFound])

  return (
    <div className="space-y-1">
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full text-xs px-3 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-50"
      >
        {loading ? '⏳ Buscando...' : '🔍 Buscar senderos (OpenStreetMap)'}
      </button>
      {resultCount !== null && (
        <p className="text-xs text-center text-gray-400">
          {resultCount > 0 ? `✅ ${resultCount} senderos encontrados` : '⚠️ No se encontraron senderos en esta zona'}
        </p>
      )}
    </div>
  )
}
