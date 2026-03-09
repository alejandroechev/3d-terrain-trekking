interface RegionFilterProps {
  regions: string[]
  selected: string | null
  onSelect: (region: string | null) => void
}

export function RegionFilter({ regions, selected, onSelect }: RegionFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por región">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selected === null
            ? 'bg-green-700 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Todas las regiones
      </button>
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => onSelect(region)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selected === region
              ? 'bg-green-700 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  )
}
