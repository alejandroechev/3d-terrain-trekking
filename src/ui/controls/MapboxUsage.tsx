interface MapboxUsageProps {
  count: number
}

const FREE_TIER_LIMIT = 200_000

export function MapboxUsage({ count }: MapboxUsageProps) {
  const percent = Math.min((count / FREE_TIER_LIMIT) * 100, 100)
  const color = percent < 50 ? '#22c55e' : percent < 80 ? '#eab308' : '#ef4444'

  return (
    <div className="bg-black/70 text-white rounded-lg p-2 text-xs">
      <div className="flex justify-between mb-1">
        <span className="text-gray-400">🗺️ Mapbox</span>
        <span style={{ color }}>
          {count.toLocaleString('en-US')} / {FREE_TIER_LIMIT.toLocaleString('en-US')}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          data-testid="usage-bar"
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${Math.max(percent, 0.5)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
