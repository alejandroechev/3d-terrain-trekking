import type { Trek } from '../../domain/trek/trek'

interface TrekCardProps {
  trek: Trek
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onSelect: (trek: Trek) => void
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function TrekCard({ trek, isFavorite, onToggleFavorite, onSelect }: TrekCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow p-3 min-h-[72px] cursor-pointer active:bg-gray-50"
      onClick={() => onSelect(trek)}
      role="article"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{trek.name}</h3>
          <span className="text-xs text-gray-500">{trek.region}</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap"
            style={{ backgroundColor: trek.difficulty.color, color: '#fff' }}
          >
            {trek.difficulty.score} {trek.difficulty.label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(trek.id)
            }}
            aria-label={isFavorite ? 'Quitar favorito' : 'Agregar favorito'}
            className="text-lg leading-none"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
        <span>{(trek.stats.totalDistanceM / 1000).toFixed(1)} km</span>
        <span>↑ {Math.round(trek.stats.totalAscentM)} m</span>
        <span>⏱ {formatTime(trek.stats.estimatedTimeMinutes)}</span>
        <span>📍 {Math.round(trek.distanceFromHomeKm)} km</span>
      </div>
    </div>
  )
}
