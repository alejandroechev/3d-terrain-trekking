import { useState } from 'react'
import { Scene3D } from './ui/terrain/Scene3D'
import { GPXImporter } from './ui/routes/GPXImporter'
import type { GPXRoute } from './domain/gpx/gpx-parser'
import { calculateRouteStats } from './domain/gpx/route-stats'

function App() {
  const [routes, setRoutes] = useState<GPXRoute[]>([])

  return (
    <div className="w-full h-screen relative bg-gray-900">
      <Scene3D />
      <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-lg pointer-events-none">
        <h1 className="text-lg font-bold">Explorador de Terreno 3D</h1>
        <p className="text-sm text-gray-300">Puerto Varas, Chile</p>
      </div>
      <div className="absolute top-4 right-4 w-72 space-y-3 pointer-events-auto">
        <GPXImporter onRoutesLoaded={(r) => setRoutes((prev) => [...prev, ...r])} />
        {routes.map((route, i) => {
          const stats = calculateRouteStats(route.points)
          return (
            <div key={i} className="bg-black/70 text-white rounded-lg p-3 text-sm">
              <h3 className="font-bold text-green-400">{route.name}</h3>
              <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-300">
                <span>📏 {(stats.totalDistanceM / 1000).toFixed(1)} km</span>
                <span>⏱️ {Math.round(stats.estimatedTimeMinutes)} min</span>
                <span>⬆️ {Math.round(stats.totalAscentM)} m</span>
                <span>⬇️ {Math.round(stats.totalDescentM)} m</span>
                <span>📐 {stats.maxGradePercent.toFixed(0)}% máx</span>
                <span>🏔️ {Math.round(stats.maxElevationM)} m</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
