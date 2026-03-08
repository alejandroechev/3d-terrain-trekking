interface TerrainControlsProps {
  exaggeration: number
  onExaggerationChange: (value: number) => void
}

export function TerrainControls({
  exaggeration,
  onExaggerationChange,
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
    </div>
  )
}
