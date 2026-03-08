import type { GPXRoute } from '../../domain/gpx/gpx-parser'
import { calculateRouteStats } from '../../domain/gpx/route-stats'
import { calculateDifficulty } from '../../domain/difficulty/difficulty'

interface RouteComparisonProps {
  routes: GPXRoute[]
}

export function RouteComparison({ routes }: RouteComparisonProps) {
  if (routes.length < 2) return null

  return (
    <div className="bg-black/70 text-white rounded-lg p-3 text-sm">
      <h3 className="font-bold text-blue-400 mb-2">📊 Comparar rutas</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left pb-1">Ruta</th>
            <th className="text-right pb-1">Dist</th>
            <th className="text-right pb-1">Asc</th>
            <th className="text-right pb-1">Dif</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, i) => {
            const stats = calculateRouteStats(route.points)
            const diff = calculateDifficulty(route.points)
            return (
              <tr key={i} className="border-t border-gray-700">
                <td className="py-1 text-green-400">{route.name}</td>
                <td className="text-right">{(stats.totalDistanceM / 1000).toFixed(1)}km</td>
                <td className="text-right">{Math.round(stats.totalAscentM)}m</td>
                <td className="text-right">
                  <span
                    className="px-1 rounded text-black font-bold"
                    style={{ backgroundColor: diff.color }}
                  >
                    {diff.score}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
