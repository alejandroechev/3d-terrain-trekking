interface TerrainControlsProps {
  exaggeration: number
  onExaggerationChange: (value: number) => void
  showSlopeHeatmap: boolean
  onToggleSlopeHeatmap: () => void
  onScreenshot: () => void
}

export function TerrainControls({
  exaggeration,
  onExaggerationChange,
  showSlopeHeatmap,
  onToggleSlopeHeatmap,
  onScreenshot,
}: TerrainControlsProps) {
  return (
    <div className="bg-black/70 text-white rounded-lg p-3 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-gray-300">🏔️ Exageración</label>
        <span className="text-green-400 font-mono">{exaggeration}x</span>
      </div>
      <input
        type="range"
        min="0.5"
        max="5"
        step="0.5"
        value={exaggeration}
        onChange={(e) => onExaggerationChange(parseFloat(e.target.value))}
        className="w-full accent-green-500"
        role="slider"
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={onToggleSlopeHeatmap}
          className={`flex-1 text-xs px-2 py-1 rounded ${
            showSlopeHeatmap
              ? 'bg-orange-500 text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {showSlopeHeatmap ? '🌡️ Pendiente ON' : '🌡️ Pendiente'}
        </button>
        <button
          onClick={onScreenshot}
          className="flex-1 text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          📸 Captura
        </button>
      </div>
    </div>
  )
}
